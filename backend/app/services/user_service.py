from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from fastapi import HTTPException

def get_users_by_role(db: Session, role: UserRole):
    return db.query(User).filter(User.role == role).all()

def create_user(db: Session, user_in: UserCreate):
    """
    Crea un nuevo usuario en la base de datos.
    """
    print("\n--- INICIO DE DEPURACIÓN: create_user ---")
    print("1. Entrando a la función create_user...")
    
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        print("Error: El email ya existe.")
        raise HTTPException(status_code=400, detail="El email ya está registrado.")

    print(f"2. Email '{user_in.email}' verificado. Procediendo a hashear la contraseña...")
    
    # El proceso probablemente se congela en la siguiente línea
    hashed_password = get_password_hash(user_in.password)
    
    print("3. Contraseña hasheada con éxito.")
    
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_password,
        role=user_in.role
    )
    
    print("4. Objeto de usuario creado. Añadiendo a la sesión de la DB...")
    db.add(new_user)
    print("5. Haciendo commit a la base de datos...")
    db.commit()
    print("6. Refrescando el objeto de usuario...")
    db.refresh(new_user)
    print("7. Creación de usuario completada.")
    print("--- FIN DE DEPURACIÓN ---\n")
    
    return new_user
