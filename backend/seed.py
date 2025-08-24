from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # Revisa si el usuario admin ya existe
    user = db.query(User).filter(User.email == "admin@gym.com").first()
    
    if not user:
        print("Creando usuario administrador...")
        admin_user = User(
            full_name="Administrador Principal",
            email="admin@gym.com",
            hashed_password=get_password_hash("adminpass"),
            role=UserRole.admin
        )
        db.add(admin_user)
        db.commit()
        print("Usuario administrador creado.")
    else:
        print("El usuario administrador ya existe.")
        
    db.close()

if __name__ == "__main__":
    seed_db()