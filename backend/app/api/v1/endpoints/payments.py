from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.payment import Payment, PaymentStatus
from app.models.user import User
from app.schemas.payment import PaymentInDB, PaymentUpdate
from app.api.v1.deps import get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[PaymentInDB])
def read_payments(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    payments = db.query(Payment).order_by(Payment.date.desc()).all()
    return payments

@router.put("/{payment_id}", response_model=PaymentInDB)
def update_payment_status(payment_id: int, payment_update: PaymentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    db_payment.status = payment_update.status
    
    # Activate user membership if payment is completed
    if payment_update.status == PaymentStatus.completed:
        member = db.query(User).filter(User.id == db_payment.user_id).first()
        if member:
            member.membership_status = "active"

    db.commit()
    db.refresh(db_payment)
    return db_payment