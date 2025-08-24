# Importa la sesión de la base de datos
from app.db.session import SessionLocal

# --- LÍNEAS NUEVAS ---
# Importa TODOS tus modelos para que SQLAlchemy los reconozca
from app.models.user import User, UserRole
from app.models.payment import Payment
from app.models.membership import Membership
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking
# ---------------------

# Importa la función para hashear la contraseña
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
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
        print("¡Usuario administrador creado con éxito!")
    else:
        print("El usuario administrador ya existe.")
        
    db.close()

if __name__ == "__main__":
    print("Iniciando el proceso de sembrado (seeding)...")
    seed_db()
    print("Proceso de sembrado finalizado.")