from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token

router = APIRouter()

@router.post("/token", response_model=Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # --- LA CORRECCIÓN ESTÁ AQUÍ ---
    # Convertimos user.role a su valor de texto con .value
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role.value, "fullName": user.full_name}
    )
    # -----------------------------

    return {"access_token": access_token, "token_type": "bearer"}