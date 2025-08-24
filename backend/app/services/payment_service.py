from sqlalchemy.orm import Session
from app.models.payment import Payment, PaymentStatus
from app.models.user import User

def get_all_payments(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene un historial de todos los pagos."""
    return db.query(Payment).order_by(Payment.date.desc()).offset(skip).limit(limit).all()

def get_payment_by_id(db: Session, payment_id: int):
    """Obtiene un pago específico por su ID."""
    return db.query(Payment).filter(Payment.id == payment_id).first()

def update_payment_status(db: Session, payment_id: int, new_status: PaymentStatus):
    """
    Actualiza el estado de un pago.
    Si el estado es 'completed', activa la membresía del usuario.
    """
    db_payment = get_payment_by_id(db, payment_id)
    if not db_payment:
        return None

    # Actualiza el estado del pago
    db_payment.status = new_status

    # Lógica de negocio CRÍTICA: Activar membresía
    if new_status == PaymentStatus.completed:
        user_to_activate = db.query(User).filter(User.id == db_payment.user_id).first()
        if user_to_activate:
            user_to_activate.membership_status = "active"
            # Aquí podrías añadir lógica para establecer una fecha de vencimiento de la membresía

    db.commit()
    db.refresh(db_payment)
    return db_payment