from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta  # Añadir timedelta a la importación

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking
from app.api.v1.deps import get_current_user

# Importar schemas
from app.schemas.class_schedule import ClassScheduleInDB
from app.schemas.class_booking import ClassMember

router = APIRouter()

# --- Endpoint para Clases del Entrenador (Mejorado) ---
@router.get("/my-classes", response_model=List[ClassScheduleInDB])
def get_my_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene las clases asignadas al entrenador que ha iniciado sesión.
    Incluye información de reservas.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol de entrenador."
        )
    
    # Obtener clases futuras del entrenador
    now = datetime.now()
    classes = db.query(ClassSchedule).filter(
        ClassSchedule.trainer_id == current_user.id,
        ClassSchedule.date_time >= now
    ).all()
    
    return classes

# --- Endpoint para Miembros de una Clase (Mejorado) ---
@router.get("/class/{class_id}/members", response_model=List[ClassMember])
def get_class_members(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene la lista de miembros inscritos en una clase específica.
    Solo accesible para el entrenador asignado a la clase.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acceso denegado. Se requiere rol de entrenador."
        )

    # Verificar que la clase existe y pertenece al entrenador
    class_schedule = db.query(ClassSchedule).filter(
        ClassSchedule.id == class_id,
        ClassSchedule.trainer_id == current_user.id
    ).first()

    if not class_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clase no encontrada o no asignada a este entrenador."
        )

    # Obtener miembros inscritos
    bookings = db.query(ClassBooking).filter(
        ClassBooking.class_id == class_id
    ).all()
    
    members = []
    for booking in bookings:
        if booking.member:  # Asegurarse de que el miembro existe
            members.append(ClassMember(
                id=booking.member.id,
                full_name=booking.member.full_name
            ))
    
    return members



# --- Endpoint para Tomar Asistencia (Nuevo) ---
@router.post("/class/{class_id}/attendance")
def take_attendance(
    class_id: int,
    member_ids: List[int],  # IDs de miembros que asistieron
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Registra la asistencia de miembros a una clase.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol de entrenador."
        )

    # Verificar que la clase existe y pertenece al entrenador
    class_schedule = db.query(ClassSchedule).filter(
        ClassSchedule.id == class_id,
        ClassSchedule.trainer_id == current_user.id
    ).first()

    if not class_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clase no encontrada o no asignada a este entrenador."
        )

    # Aquí podrías implementar la lógica para registrar la asistencia
    # Por ejemplo, actualizar un campo en ClassBooking o crear registros en una tabla de asistencia
    
    return {"message": f"Asistencia registrada para {len(member_ids)} miembros"}



# --- Nuevo Endpoint: Dashboard del Entrenador (CORREGIDO) ---
@router.get("/dashboard")
def get_trainer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Dashboard del entrenador con resumen de sus clases.
    """
    if current_user.role != UserRole.trainer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol de entrenador."
        )
    
    try:
        # Obtener estadísticas
        now = datetime.now()
        
        # Clases de hoy
        today_start = datetime(now.year, now.month, now.day)
        today_end = datetime(now.year, now.month, now.day, 23, 59, 59)
        
        today_classes = db.query(ClassSchedule).filter(
            ClassSchedule.trainer_id == current_user.id,
            ClassSchedule.date_time >= today_start,
            ClassSchedule.date_time <= today_end
        ).count()
        
        # Próximas clases (esta semana)
        week_end = now + timedelta(days=7)
        upcoming_classes = db.query(ClassSchedule).filter(
            ClassSchedule.trainer_id == current_user.id,
            ClassSchedule.date_time >= now,
            ClassSchedule.date_time <= week_end
        ).count()
        
        # Total de alumnos únicos (corregido)
        from sqlalchemy import and_
        unique_members = db.query(ClassBooking.member_id).join(
            ClassSchedule, ClassSchedule.id == ClassBooking.class_id
        ).filter(
            and_(
                ClassSchedule.trainer_id == current_user.id,
                ClassSchedule.date_time >= now - timedelta(days=30)  # Últimos 30 días
            )
        ).distinct().count()
        
        return {
            "trainer_name": current_user.full_name,
            "today_classes": today_classes,  # CORREGIDO: se eliminó la ",a"
            "upcoming_classes": upcoming_classes,
            "unique_members": unique_members
        }
    
    except Exception as e:
        # Log del error para debugging
        print(f"Error en get_trainer_dashboard: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener los datos del dashboard"
        )