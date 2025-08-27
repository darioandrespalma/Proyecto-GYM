# backend/app/api/v1/endpoints/trainer_endpoints.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.class_schedule import ClassSchedule
from app.api.v1.deps import get_current_user

# --- IMPORTACIONES CORRECTAS ---
from app.schemas.class_schedule import ClassScheduleInDB
from app.schemas.class_booking import ClassMember

router = APIRouter()


# --- RESPONSE_MODEL CORRECTO ---
@router.get("/my-classes", response_model=List[ClassScheduleInDB])
def get_my_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene las clases asignadas al entrenador que ha iniciado sesión.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol de entrenador."
        )
    
    classes = db.query(ClassSchedule).filter(ClassSchedule.trainer_id == current_user.id).all()
    return classes


@router.get("/class/{class_id}/members", response_model=List[ClassMember])
def get_class_members(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene la lista de miembros inscritos en una clase específica.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado.")

    class_schedule = db.query(ClassSchedule).filter(
        ClassSchedule.id == class_id,
        ClassSchedule.trainer_id == current_user.id
    ).first()

    if not class_schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clase no encontrada o no asignada a este entrenador.")

    members = [booking.member for booking in class_schedule.bookings]
    return members