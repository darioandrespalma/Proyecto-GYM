from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User, UserRole
from app.api.v1.deps import get_current_user # Usamos get_current_user normal

router = APIRouter()

@router.get("/my-classes")
def get_my_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene las clases asignadas al entrenador que ha iniciado sesión.
    """
    if current_user.role != UserRole.trainer:
        return [] # O un error 403 si prefieres
    
    # Aquí iría la lógica para buscar en la DB las clases con trainer_id == current_user.id
    # Por ahora, devolvemos datos de ejemplo
    mock_classes = [
        { "id": 1, "name": 'Yoga Matutino', "time": '08:00 AM', "attendees": 12, "max": 15 },
        { "id": 2, "name": 'HIIT Intenso', "time": '10:00 AM', "attendees": 18, "max": 20 },
    ]
    return mock_classes
