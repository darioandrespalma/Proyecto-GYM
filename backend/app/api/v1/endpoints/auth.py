from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.token import Token
# --- IMPORTACIONES NUEVAS ---
from app.schemas.user import UserCreate, UserInDB
from app.services import user_service

router = APIRouter()

# --- NUEVO ENDPOINT PARA REGISTRO ---
@router.post("/register", response_model=UserInDB, status_code=201)
def register_new_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
):
    """
    Crea un nuevo usuario (miembro por defecto).
    """
    # Forzar el rol a 'member' por seguridad, para que nadie pueda registrarse como admin
    user_in.role = UserRole.member
    
    # Reutilizamos la función de user_service que ya creamos
    return user_service.create_user(db=db, user_in=user_in)


@router.post("/token", response_model=Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role.value, "fullName": user.full_name}
    )
    return {"access_token": access_token, "token_type": "bearer"}
