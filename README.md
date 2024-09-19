# Proyecto Backend

## Descripción
Este es un backend desarrollado en Node.js que proporciona una API RESTful para manejar usuarios, productos y carritos de compras. También se incluye la autenticación de usuarios utilizando Passport.

## Características
- **Autenticación**: Implementada con Passport.
- **Gestión de Usuarios**: Modelo de usuarios y autenticación.
- **Gestión de Productos**: CRUD de productos.
- **Gestión de Carritos**: Funcionalidad para manejar carritos de compras.
- **API RESTful**: Rutas para manejar sesiones, productos y carritos.
- **Middleware**: Validaciones de autenticación con middleware personalizado.

## Estructura del Proyecto

/proyecto-backend
│
├── /src
│   ├── /class
│   │   └── productManager.js   # Lógica para manejar productos
│   ├── /config
│   │   └── passport.config.js  # Configuración de Passport
│   ├── /middleware
│   │   └── auth.js             # Middleware de autenticación
│   ├── /models
│   │   ├── cart.model.js       # Modelo de carritos
│   │   ├── product.model.js    # Modelo de productos
│   │   └── user.model.js       # Modelo de usuarios
│   ├── /routes
│   │   ├── /api
│   │   │   ├── cart.router.js  # Rutas del carrito
│   │   │   ├── product.router.js # Rutas de productos
│   │   │   └── session.routes.js # Rutas de sesión
│   │   └── views.routes.js     # Rutas para vistas
│   ├── /public
│   │   ├── products.js         # Script público de productos
│   │   └── RTP.js              # Script de procesamiento
│   ├── app.js                  # Archivo principal de la aplicación
│   └── utils.js                # Utilidades generales
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de configuración de entorno
├── package.json                # Dependencias y scripts de npm
└── package-lock.json            # Versiones de dependencias

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/DiegoGR22/proyecto-backend/tree/primera-entrega2

2. Navega al directorio del proyecto:
    ```bash
   cd proyecto-backend

4. Instala las dependencias:
    ```bash
   npm install

4.	Configura el archivo .env con tus credenciales de base de datos y otros parámetros. Puedes guiarte del archivo .env.example.

## Uso

1.	Para iniciar el servidor en modo desarrollo:
    ```bash
    npm run dev

2.	El servidor estará corriendo en http://localhost:3000.

## Rutas Principales

	•	Autenticación:
	•	POST /api/session/login: Iniciar sesión.
	•	POST /api/session/signup: Registrar usuario.
	•	Productos:
	•	GET /api/products: Obtener lista de productos.
	•	POST /api/products: Crear un nuevo producto.
	•	Carritos:
	•	GET /api/cart: Ver contenido del carrito.
	•	POST /api/cart: Añadir productos al carrito.

## Contribución

	1.	Haz un fork del proyecto.
	2.	Crea una nueva rama (git checkout -b feature/nueva-feature).
	3.	Realiza los cambios necesarios y realiza un commit (git commit -m 'Añadir nueva feature').
	4.	Sube tus cambios a la rama principal (git push origin feature/nueva-feature).
	5.	Crea un pull request.

## Licencia

Este proyecto está bajo la licencia MIT.