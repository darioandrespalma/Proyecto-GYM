from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.schemas.payment import PaymentInDB, PaymentUpdate # Asegúrate de tener estos schemas
from app.services.payment_service import get_all_payments, update_payment_status, get_payment_by_id, get_payments_by_status
from app.services import payment_service
from app.api.v1.deps import get_current_admin_user
from app.models.payment import PaymentStatus

router = APIRouter()

@router.get("/", response_model=List[PaymentInDB])
def read_payments(
    skip: int = 0,
    limit: int = 100,
    status: PaymentStatus | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Obtiene una lista de todos los pagos, opcionalmente filtrados por estado.
    Solo para administradores.
    """
    if status:
        payments = get_payments_by_status(db, status)
    else:
        payments = get_all_payments(db, skip=skip, limit=limit)
    return payments

@router.get("/{payment_id}", response_model=PaymentInDB)
def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Obtiene un pago específico por ID.
    Solo para administradores.
    """
    payment = get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )
    return payment

@router.put("/{payment_id}", response_model=PaymentInDB)
def update_payment(
    payment_id: int,
    payment_update: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Actualiza el estado de un pago.
    Solo para administradores.
    """
    payment = get_payment_by_id(db, payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )
    
    try:
        updated_payment = update_payment_status(db, payment_id, payment_update.status)
        return updated_payment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el pago: {str(e)}"
        )