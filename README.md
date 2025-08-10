# 🏋️‍♂️ GymPower - Sistema Integral de Gestión para Gimnasios

**Solución todo-en-uno para la gestión moderna de gimnasios** con tecnología React + FastAPI

## 🌟 Características Destacadas

### 💻 Frontend Avanzado
- **Dashboard interactivo** con métricas clave
- **Sistema de reservas** para clases grupales
- **Perfiles de miembros** con progreso fitness
- **Calendario integrado** de actividades
- **Chat interno** para comunicación con entrenadores

### ⚙️ Backend Robustecido
- **API documentada** con Swagger/OpenAPI
- **Autenticación multifactor** (SMS/Email)
- **Sistema de notificaciones** en tiempo real
- **Integración con wearables** (Fitbit, Apple Health)
- **Reportes analíticos** personalizables

## 🛠️ Configuración Profesional

### 🔧 Requisitos del Sistema
| Componente | Versión | Notas |
|------------|---------|-------|
| Node.js | 18+ | LTS recomendado |
| Python | 3.10+ | Con soporte para async |
| PostgreSQL | 14+ | Con extensión PostGIS |
| Redis | 6+ | Para cache y colas |

### 🚀 Instalación Paso a Paso

#### Backend (Configuración Profesional)
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/gympower.git
cd gympower/backend

# 2. Configurar entorno virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# 3. Instalar dependencias con optimizaciones
pip install --upgrade pip wheel
pip install -r requirements.txt --no-cache-dir

# 4. Configuración avanzada de entorno
cp .env.example .env
nano .env  # Editar con valores reales

# Variables críticas a configurar:
# DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
# SECRET_KEY=generar-con-openssl-rand-hex-32
# CORS_ORIGINS=https://tudominio.com,http://localhost:5173

# 5. Migraciones y datos iniciales
alembic upgrade head
python -m app.seed  # Datos demo (opcional)

# 6. Ejecución en modo producción con auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --workers 2

## Frontend (Configuración Avanzada)
cd ../frontend

# 1. Instalar dependencias optimizadas
npm ci --production

# 2. Variables de entorno
cp .env.example .env.local
# Configurar:
# VITE_API_BASE_URL=https://api.tudominio.com
# VITE_SENTRY_DSN=tu-dsn-de-sentry

# 3. Ejecución con análisis de bundle
npm run dev -- --profile

# 4. Suite de pruebas completa
npm test -- --coverage --watchAll=false

```
## Frontend (Configuración Avanzada)
cd ../frontend

### 1. Instalar dependencias optimizadas
npm ci --production

### 2. Variables de entorno
cp .env.example .env.local
### Configurar:
### VITE_API_BASE_URL=https://api.tudominio.com
### VITE_SENTRY_DSN=tu-dsn-de-sentry

### 3. Ejecución con análisis de bundle
npm run dev -- --profile

### 4. Suite de pruebas completa
npm test -- --coverage --watchAll=false


## 🗃️ Arquitectura del Sistema
gympower/
├── backend/
│   ├── alembic/               # Migraciones de base de datos
│   ├── app/
│   │   ├── api/               # Endpoints organizados por versión
│   │   ├── core/              # Configuración centralizada
│   │   ├── db/                # Acceso a base de datos
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── schemas/           # Validación Pydantic
│   │   ├── services/          # Lógica de negocio
│   │   ├── tasks/             # Tareas asíncronas con Celery
│   │   ├── utils/             # Utilidades comunes
│   │   └── main.py            # Punto de entrada
│   ├── tests/                 # Pruebas unitarias e integración
│   └── requirements/          # Dependencias separadas por entorno
├── frontend/
│   ├── public/                # Assets estáticos
│   ├── src/
│   │   ├── api/               # Clientes API
│   │   ├── assets/            # Imágenes, fuentes
│   │   ├── components/        # Componentes UI reutilizables
│   │   ├── contexts/          # Gestión de estado global
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # Estructuras de página
│   │   ├── pages/             # Vistas/rutas
│   │   ├── stores/            # Gestión de estado (Zustand)
│   │   ├── styles/            # Estilos globales
│   │   ├── utils/             # Funciones auxiliares
│   │   └── main.jsx           # Punto de entrada
│   ├── cypress/               # Pruebas E2E
│   └── jest/                  # Configuración de pruebas
├── docker/                    # Configuraciones Docker
├── docs/                      # Documentación técnica
└── scripts/                   # Scripts de automatización








