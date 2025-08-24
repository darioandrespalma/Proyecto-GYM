from sqlalchemy.orm import Session
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking
from app.schemas.class_schedule import ClassScheduleCreate # Asumiendo que tienes este schema

def get_class_by_id(db: Session, class_id: int):
    """Obtiene una clase específica por su ID."""
    return db.query(ClassSchedule).filter(ClassSchedule.id == class_id).first()

def get_all_classes(db: Session, skip: int = 0, limit: int = 100):
    """Obtiene una lista de todas las clases programadas."""
    return db.query(ClassSchedule).offset(skip).limit(limit).all()

def create_class(db: Session, class_to_create: ClassScheduleCreate):
    """Crea una nueva clase en el horario."""
    db_class = ClassSchedule(
        name=class_to_create.name,
        trainer_id=class_to_create.trainer_id,
        date_time=class_to_create.date_time,
        duration_minutes=class_to_create.duration_minutes,
        max_capacity=class_to_create.max_capacity
    )
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

def book_class_for_member(db: Session, class_id: int, member_id: int):
    """Registra la reserva de un miembro para una clase."""
    
    # 1. Verificar si la clase existe y no está llena
    db_class = get_class_by_id(db, class_id)
    if not db_class:
        return {"error": "La clase no existe."}

    current_bookings = len(db_class.bookings)
    if current_bookings >= db_class.max_capacity:
        return {"error": "La clase ya está llena."}

    # 2. Verificar que el miembro no haya reservado ya esta clase
    existing_booking = db.query(ClassBooking).filter(
        ClassBooking.class_id == class_id,
        ClassBooking.member_id == member_id
    ).first()

    if existing_booking:
        return {"error": "Ya has reservado esta clase."}

    # 3. Crear la reserva
    new_booking = ClassBooking(class_id=class_id, member_id=member_id)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking