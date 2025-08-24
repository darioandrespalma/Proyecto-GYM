from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core import config
from app.db.session import get_db
# --- CORRECCIÓN: Importar UserRole junto con User ---
from app.models.user import User, UserRole
from app.schemas.token import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_admin_user(current_user: User = Depends(get_current_user)):
    # --- CAMBIO CLAVE Y SOLUCIÓN DEFINITIVA ---
    # Comparamos el valor de texto (.value) del Enum del usuario.
    # Esto asegura que la comparación sea correcta: "admin" == "admin"
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="No tienes suficientes privilegios")
    # -----------------------------------------
    return current_user
