from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
# Asegúrate de tener los schemas correspondientes en la carpeta schemas
from app.schemas.class_schedule import ClassScheduleCreate, ClassScheduleInDB
from app.services import class_service
from app.api.v1.deps import get_current_admin_user

# --- LA LÍNEA MÁS IMPORTANTE QUE FALTABA ---
router = APIRouter()
# -----------------------------------------
@router.get("/", response_model=List[ClassScheduleInDB])
def get_all_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Obtiene una lista de todas las clases programadas.
    Solo para administradores.
    """
    classes = class_service.get_all_classes(db=db)
    return classes

@router.post("/", response_model=ClassScheduleInDB, status_code=201)
def create_new_class(
    *,
    db: Session = Depends(get_db),
    class_in: ClassScheduleCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Crea una nueva clase.
    Solo para administradores.
    """
    new_class = class_service.create_class(db=db, class_to_create=class_in)
    return new_class