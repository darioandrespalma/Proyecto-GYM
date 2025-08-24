from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services import user_service
from app.api.v1.deps import get_current_admin_user
from app.schemas.user import UserCreate, UserInDB # Importar los schemas

router = APIRouter()

@router.get("/", response_model=List[UserInDB])
def read_trainers(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_admin_user)
):
    """
    Obtiene una lista de todos los entrenadores.
    """
    return user_service.get_users_by_role(db, role=UserRole.trainer)

# --- ENDPOINT NUEVO AÑADIDO ---
@router.post("/", response_model=UserInDB, status_code=201)
def create_new_trainer(
    *,
    db: Session = Depends(get_db),
    trainer_in: UserCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """
    Crea un nuevo entrenador.
    El rol debe ser 'trainer' en los datos enviados.
    """
    # Aquí podrías añadir una validación extra para asegurar que el rol sea 'trainer'
    if trainer_in.role != UserRole.trainer:
        raise HTTPException(status_code=400, detail="El rol debe ser 'trainer'.")
        
    return user_service.create_user(db=db, user_in=trainer_in)
