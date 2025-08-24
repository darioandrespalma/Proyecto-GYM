from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from fastapi import HTTPException

def get_users_by_role(db: Session, role: UserRole):
    return db.query(User).filter(User.role == role).all()

# --- FUNCIÓN NUEVA AÑADIDA ---
def create_user(db: Session, user_in: UserCreate):
    """
    Crea un nuevo usuario en la base de datos.
    """
    # Revisar si el email ya existe
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado.")

    # Hashear la contraseña antes de guardarla
    hashed_password = get_password_hash(user_in.password)
    
    # Crear el nuevo objeto de usuario para la base de datos
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_password,
        role=user_in.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user
