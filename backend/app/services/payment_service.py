from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta
import random
import string

from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.user import User, MembershipStatus
from app.models.membership import Membership

def generate_transaction_id(length=12):
    """Genera un ID de transacción único"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def create_payment(db: Session, user_id: int, payment_data: dict):
    """Crea un nuevo registro de pago"""
    try:
        # Generar ID de transacción
        transaction_id = f"TXN{generate_transaction_id()}"
        
        # Determinar el estado inicial basado en el método de pago
        status = PaymentStatus.pending
        if payment_data["payment_method"] in [PaymentMethod.credit_card, PaymentMethod.debit_card]:
            status = PaymentStatus.completed  # Simulamos pago inmediato para tarjetas
        
        # Crear el pago
        db_payment = Payment(
            user_id=user_id,
            membership_type=payment_data["membership_type"],
            amount=payment_data["amount"],
            payment_method=payment_data["payment_method"],
            status=status,
            transaction_id=transaction_id,
            comprobante_url=payment_data.get("comprobante_url")
        )
        
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        # Si el pago es completado, activar la membresía
        if status == PaymentStatus.completed:
            activate_membership(db, user_id, payment_data["membership_type"])
        
        return db_payment
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_payments_by_user(db: Session, user_id: int):
    """Obtiene todos los pagos de un usuario"""
    return db.query(Payment).filter(Payment.user_id == user_id).all()

def get_all_payments(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene todos los pagos (para administradores)"""
    return db.query(Payment).order_by(Payment.created_at.desc()).offset(skip).limit(limit).all()

def get_payment_by_id(db: Session, payment_id: int):
    """Obtiene un pago por su ID"""
    return db.query(Payment).filter(Payment.id == payment_id).first()

def update_payment_status(db: Session, payment_id: int, status: PaymentStatus):
    """Actualiza el estado de un pago"""
    try:
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            return None
        
        payment.status = status
        db.commit()
        db.refresh(payment)
        
        # Si se aprueba el pago, activar la membresía
        if status == PaymentStatus.completed:
            activate_membership(db, payment.user_id, payment.membership_type)
        
        return payment
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def activate_membership(db: Session, user_id: int, membership_type: str):
    """Activa la membresía de un usuario"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        # Obtener la duración de la membresía
        membership = db.query(Membership).filter(Membership.name == membership_type).first()
        if not membership:
            return None
        
        # Calcular fechas de inicio y fin
        start_date = datetime.now()
        end_date = start_date + timedelta(days=membership.duration_days)
        
        # Actualizar usuario
        user.membership_status = MembershipStatus.active
        user.membership_start = start_date
        user.membership_end = end_date
        
        db.commit()
        db.refresh(user)
        
        return user
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_payments_by_status(db: Session, status: PaymentStatus):
    """Obtiene pagos filtrados por estado"""
    return db.query(Payment).filter(Payment.status == status).all()