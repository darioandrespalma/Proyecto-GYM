from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import uuid
from typing import Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserRole
from app.api.v1.deps import get_current_user
from app.schemas.payment import PaymentCreate, PaymentInDB, PaymentMethod
from app.services.payment_service import create_payment, get_payments_by_user
from app.models.payment import PaymentMethod as PaymentMethodModel
from app.models.membership import Membership
from app.models.payment import PaymentStatus

router = APIRouter()

# Configuración para guardar comprobantes
UPLOAD_DIR = "uploads/comprobantes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=PaymentInDB, status_code=status.HTTP_201_CREATED)
async def create_member_payment(
    membership_type: str = Form(...),
    payment_method: PaymentMethod = Form(...),
    amount: float = Form(...),
    comprobante: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crea un nuevo pago de membresía para el usuario actual.
    """
    if current_user.role != UserRole.member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los miembros pueden realizar pagos"
        )
    
    # Validar que el tipo de membresía existe
    membership = db.query(Membership).filter(Membership.name == membership_type).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de membresía no válido"
        )
    
    # Validar que el monto coincida con el precio de la membresía
    if abs(amount - membership.price) > 0.01:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El monto no coincide con el precio de la membresía"
        )
    
    comprobante_url = None
    
    # Procesar comprobante si es transferencia bancaria
    if payment_method == PaymentMethod.bank_transfer:
        if not comprobante:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Se requiere un comprobante para transferencias bancarias"
            )
        
        # Validar que sea un PDF
        if not comprobante.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El comprobante debe ser un archivo PDF"
            )
        
        # Guardar el archivo
        file_extension = comprobante.filename.split('.')[-1]
        filename = f"{current_user.id}_{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await comprobante.read()
            buffer.write(content)
        
        comprobante_url = file_path
    
    # Crear el pago
    payment_data = {
        "membership_type": membership_type,
        "amount": amount,
        "payment_method": payment_method,
        "comprobante_url": comprobante_url
    }
    
    try:
        payment = create_payment(db, current_user.id, payment_data)
        return payment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar el pago: {str(e)}"
        )

@router.get("/", response_model=list[PaymentInDB])
def get_member_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene el historial de pagos del usuario actual.
    """
    if current_user.role != UserRole.member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los miembros pueden ver sus pagos"
        )
    
    payments = get_payments_by_user(db, current_user.id)
    return payments

@router.get("/methods")
def get_payment_methods():
    """
    Devuelve los métodos de pago disponibles.
    """
    return [
        {
            "value": "credit_card",
            "label": "Tarjeta de Crédito/Débito",
            "description": "Pago seguro con tarjeta (procesamiento inmediato)"
        },
        {
            "value": "bank_transfer",
            "label": "Transferencia Bancaria",
            "description": "Transfiere desde tu banco y sube el comprobante"
        },
        {
            "value": "cash",
            "label": "Efectivo",
            "description": "Paga directamente en recepción"
        }
    ]