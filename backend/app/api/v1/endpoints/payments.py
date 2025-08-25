from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.schemas.payment import PaymentInDB, PaymentUpdate # Asegúrate de tener estos schemas
from app.services import payment_service
from app.api.v1.deps import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[PaymentInDB])
def read_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Obtiene una lista de todos los pagos.
    """
    return payment_service.get_all_payments(db=db)

@router.put("/{payment_id}", response_model=PaymentInDB)
def approve_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Aprueba un pago pendiente, cambiando su estado a 'completed'.
    """
    updated_payment = payment_service.update_payment_status(
        db=db, payment_id=payment_id, new_status="completed"
    )
    if not updated_payment:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return updated_payment
