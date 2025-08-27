# backend/app/api/v1/endpoints/member_endpoints.py (NUEVO ARCHIVO)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking
from app.models.membership import Membership
from app.api.v1.deps import get_current_user

# Importa los schemas que necesitaremos
from app.schemas.class_schedule import ClassScheduleInDB
from app.schemas.membership import Membership as MembershipSchema
from app.schemas.user import User as UserSchema

router = APIRouter()

# --- Endpoint para el Dashboard del Miembro ---
@router.get("/dashboard")
def get_member_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso no autorizado")
    
    # Lógica para calcular días restantes, etc., se puede añadir aquí
    # Por ahora, devolvemos información básica
    upcoming_classes = db.query(ClassBooking).filter(ClassBooking.member_id == current_user.id).count()
    
    return {
        "full_name": current_user.full_name,
        "membership_status": current_user.membership_status,
        "days_remaining": 30, # Simulado por ahora
        "upcoming_classes_count": upcoming_classes
    }

# --- Endpoints para el Horario de Clases ---
@router.get("/schedule", response_model=List[ClassScheduleInDB])
def get_full_schedule(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Devuelve todas las clases disponibles."""
    return db.query(ClassSchedule).all()

@router.post("/schedule/book/{class_id}")
def book_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar si la clase existe y tiene cupos
    target_class = db.query(ClassSchedule).filter(ClassSchedule.id == class_id).first()
    if not target_class:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clase no encontrada")

    # Verificar si el usuario ya está inscrito
    existing_booking = db.query(ClassBooking).filter_by(member_id=current_user.id, class_id=class_id).first()
    if existing_booking:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ya estás inscrito en esta clase")

    new_booking = ClassBooking(member_id=current_user.id, class_id=class_id)
    db.add(new_booking)
    db.commit()
    return {"message": "Reserva realizada con éxito"}

@router.delete("/schedule/cancel/{class_id}")
def cancel_booking(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking_to_delete = db.query(ClassBooking).filter_by(member_id=current_user.id, class_id=class_id).first()
    if not booking_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontró la reserva")
    
    db.delete(booking_to_delete)
    db.commit()
    return {"message": "Reserva cancelada"}


# --- Endpoints para Membresías ---
@router.get("/memberships", response_model=List[MembershipSchema])
def get_all_memberships(db: Session = Depends(get_db)):
    """Devuelve todos los planes de membresía disponibles."""
    return db.query(Membership).all()