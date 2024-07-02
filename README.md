# Sistema de Gestión de Documentos

Este es un sistema para almacenar, organizar y gestionar documentos digitales. Incluye las siguientes características:

- **Almacenamiento de documentos**: Subida, descarga y almacenamiento seguro de documentos.
- **Organización por categorías**: Clasificación y organización de documentos por categorías y etiquetas.
- **Búsqueda y recuperación**: Funcionalidad de búsqueda avanzada para localizar documentos.
- **Control de versiones**: Gestión de versiones de documentos, historial de cambios.
- **Generación de reportes**: Generación de reportes en formato ZIP con la información de los documentos.

## Tecnologías Utilizadas

- **Lenguaje de programación**: JavaScript (Node.js/Express)
- **Base de datos**: MongoDB (Atlas)
- **Librerías de seguridad**: Passport.js, Bcrypt.js
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 4

## Configuración del Entorno

1. Clonar el repositorio.
2. Crear un archivo `.env` en el directorio `backend` con las siguientes variables de entorno:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_atlas_uri
    JWT_SECRET=your_jwt_secret
    ```

3. Instalar las dependencias del backend:

    ```bash
    cd backend
    npm install
    ```

4. Iniciar el servidor backend:

    ```bash
    npm start
    ```

5. Abrir `frontend/views/index.html` en un navegador web para acceder a la interfaz gráfica de usuario.

## Funcionalidades de Seguridad

- **Autenticación y autorización**: Implementada con Passport.js.
- **Encriptación de documentos**: Los documentos subidos son encriptados antes de almacenarse.
- **Validación de entradas**: Para prevenir ataques y accesos no autorizados.
- **Plan de recuperación ante desastres y monitoreo**: Generación de reportes y auditoría de accesos.

## Estructura del Proyecto

```plaintext
sistema-gestion-documentos/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── documentController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── documentModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   ├── config/
│   │   ├── database.js
│   │   ├── passport.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── utils/
│   │   ├── reportGenerator.js
│   ├── app.js
│   ├── .env
│   ├── package.json
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   ├── styles.css
│   │   ├── js/
│   │   │   ├── scripts.js
│   ├── views/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── dashboard.html
└── README.md
