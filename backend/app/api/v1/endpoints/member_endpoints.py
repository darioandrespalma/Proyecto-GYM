from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from sqlalchemy.orm import Session
import os
import uuid
from typing import Optional, List
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, UserRole, MembershipStatus
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking
from app.api.v1.deps import get_current_user

from app.models.membership import Membership

# Importar schemas
from app.schemas.class_schedule import AvailableClass, ClassScheduleInDB
from app.schemas.membership import Membership as MembershipSchema
from app.schemas.user import User as UserSchema

router = APIRouter()

# --- Endpoint para Clases Disponibles (NUEVO) ---
@router.get("/available-classes", response_model=List[AvailableClass])
def get_available_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene clases disponibles para miembros con membresía activa.
    Incluye información de cupos disponibles y si el usuario ya está inscrito.
    """
    if current_user.role != UserRole.member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los miembros pueden ver las clases disponibles"
        )
    
    # Verificar membresía activa
    if current_user.membership_status != MembershipStatus.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu membresía no está activa. Renueva tu membresía para ver las clases."
        )
    
    # Obtener clases futuras
    now = datetime.now()
    future_classes = db.query(ClassSchedule).filter(
        ClassSchedule.date_time >= now
    ).all()
    
    available_classes = []
    
    for class_schedule in future_classes:
        # Contar reservas para esta clase
        bookings_count = db.query(ClassBooking).filter(
            ClassBooking.class_id == class_schedule.id
        ).count()
        
        # Calcular cupos disponibles
        available_slots = max(0, class_schedule.max_capacity - bookings_count)
        
        # Verificar si el usuario ya está inscrito
        is_booked = db.query(ClassBooking).filter(
            ClassBooking.class_id == class_schedule.id,
            ClassBooking.member_id == current_user.id
        ).first() is not None
        
        # Obtener nombre del entrenador
        trainer_name = class_schedule.trainer.full_name if class_schedule.trainer else "Entrenador no asignado"
        
        # Crear objeto de respuesta
        available_class = AvailableClass(
            id=class_schedule.id,
            name=class_schedule.name,
            date_time=class_schedule.date_time,
            duration_minutes=class_schedule.duration_minutes,
            max_capacity=class_schedule.max_capacity,
            available_slots=available_slots,
            trainer_name=trainer_name,
            is_booked=is_booked
        )
        
        available_classes.append(available_class)
    
    return available_classes











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