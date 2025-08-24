from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services import user_service
from app.api.v1.deps import get_current_admin_user

router = APIRouter()

@router.get("/")
def read_trainers(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """
    Obtiene una lista de todos los entrenadores.
    """
    return user_service.get_users_by_role(db, role=UserRole.trainer)