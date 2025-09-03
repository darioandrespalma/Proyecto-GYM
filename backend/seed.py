import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Importaciones de la aplicación
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.payment import Payment, PaymentStatus
# --- 1. IMPORTACIÓN AÑADIDA ---
# Importamos el Enum para usarlo directamente
from app.models.payment import PaymentMethod
from app.models.membership import Membership
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking

def seed_db():
    """
    Puebla la base de datos con datos de prueba realistas y conectados.
    Es seguro ejecutar este script múltiples veces.
    """
    db = SessionLocal()
    print("Iniciando el proceso de sembrado (seeding)...")

    try:
        # --- 1. Crear Planes de Membresía (sin cambios) ---
        memberships = {
            "Básico": Membership(name="Básico", price=29.99, duration_days=30, description="Acceso a máquinas y vestidores."),
            "Premium": Membership(name="Premium", price=49.99, duration_days=30, description="Todo lo Básico + acceso a clases."),
            "VIP": Membership(name="VIP", price=79.99, duration_days=30, description="Todo lo Premium + entrenador personal."),
        }
        for name, membership_obj in memberships.items():
            if not db.query(Membership).filter(Membership.name == name).first():
                db.add(membership_obj)
                print(f"Membresía '{name}' creada.")
        db.commit()

        # --- 2. Crear Usuarios (sin cambios) ---
        users = {}
        def create_user(full_name: str, email: str, password: str, role: UserRole):
            if not db.query(User).filter(User.email == email).first():
                new_user = User(full_name=full_name, email=email, hashed_password=get_password_hash(password), role=role)
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                users[email] = new_user
                print(f"Usuario '{full_name}' ({role.value}) creado.")
            else:
                users[email] = db.query(User).filter(User.email == email).first()

        create_user("Admin Principal", "admin@gym.com", "adminpass", UserRole.admin)
        trainers_data = [{"name": "Ana Fuentes", "email": "ana.trainer@gym.com"}, {"name": "Carlos Roca", "email": "carlos.trainer@gym.com"}]
        for trainer in trainers_data:
            create_user(trainer["name"], trainer["email"], "trainerpass", UserRole.trainer)
        
        members_data = [{"name": "Juan Pérez", "email": "juan.perez@email.com"}, {"name": "Maria Garcia", "email": "maria.garcia@email.com"}, {"name": "Pedro Rodriguez", "email": "pedro.r@email.com"}]
        for member in members_data:
            create_user(member["name"], member["email"], "memberpass", UserRole.member)

        # --- 3. Crear Clases (sin cambios) ---
        ana = users.get("ana.trainer@gym.com")
        carlos = users.get("carlos.trainer@gym.com")
        if ana and carlos:
            classes_data = [
                ClassSchedule(name="Yoga Matutino", trainer_id=ana.id, date_time=datetime.now() + timedelta(days=1, hours=8), duration_minutes=60, max_capacity=15),
                ClassSchedule(name="HIIT Intenso", trainer_id=carlos.id, date_time=datetime.now() + timedelta(days=1, hours=10), duration_minutes=45, max_capacity=20),
            ]
            for class_obj in classes_data:
                if not db.query(ClassSchedule).filter(ClassSchedule.name == class_obj.name, ClassSchedule.trainer_id == class_obj.trainer_id).first():
                    db.add(class_obj)
                    print(f"Clase '{class_obj.name}' creada.")
            db.commit()

        # --- 4. Crear Pagos (CORREGIDO) ---
        juan = users.get("juan.perez@email.com")
        maria = users.get("maria.garcia@email.com")
        pedro = users.get("pedro.r@email.com")
        
        if juan and maria and pedro:
            # Usamos los miembros del Enum en lugar de texto plano
            payments_data = [
                Payment(user_id=juan.id, membership_type="Premium", amount=49.99, payment_method=PaymentMethod.credit_card, status=PaymentStatus.completed, transaction_id=f"TXN{random.randint(1000,9999)}"),
                Payment(user_id=maria.id, membership_type="Premium", amount=49.99, payment_method=PaymentMethod.bank_transfer, status=PaymentStatus.pending, transaction_id=f"TXN{random.randint(1000,9999)}"),
                Payment(user_id=pedro.id, membership_type="Básico", amount=29.99, payment_method=PaymentMethod.credit_card, status=PaymentStatus.rejected, transaction_id=f"TXN{random.randint(1000,9999)}"),
            ]
            for payment_obj in payments_data:
                # Una verificación más robusta para evitar pagos duplicados
                exists = db.query(Payment).filter(Payment.transaction_id == payment_obj.transaction_id).first()
                if not exists:
                    db.add(payment_obj)
                    if payment_obj.status == PaymentStatus.completed:
                        user_to_activate = db.query(User).filter(User.id == payment_obj.user_id).first()
                        if user_to_activate: 
                            user_to_activate.membership_status = "active"
                            user_to_activate.membership_start = datetime.now()
                            user_to_activate.membership_end = datetime.now() + timedelta(days=30)
                    print(f"Pago creado para el usuario ID {payment_obj.user_id}.")
            db.commit()


        # --- 5. Crear Reservas de Clases (sin cambios) ---
        yoga_class = db.query(ClassSchedule).filter(ClassSchedule.name == "Yoga Matutino").first()
        hiit_class = db.query(ClassSchedule).filter(ClassSchedule.name == "HIIT Intenso").first()
        if yoga_class and hiit_class and juan and maria:
            bookings_data = [
                ClassBooking(member_id=juan.id, class_id=yoga_class.id),
                ClassBooking(member_id=juan.id, class_id=hiit_class.id),
                ClassBooking(member_id=maria.id, class_id=yoga_class.id),
            ]
            for booking in bookings_data:
                exists = db.query(ClassBooking).filter_by(member_id=booking.member_id, class_id=booking.class_id).first()
                if not exists:
                    db.add(booking)
                    print(f"Reserva creada para usuario ID {booking.member_id} en clase ID {booking.class_id}.")
            db.commit()

        print("\nProceso de sembrado finalizado con éxito.")

    except Exception as e:
        print(f"Ocurrió un error durante el sembrado: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()