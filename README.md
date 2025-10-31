Taller de Programación 2 - Examen de API (Listings)Este repositorio contiene la implementación de la API de listings para el examen de TP2. El proyecto está construido con Node.js, Express y MongoDB.Instrucciones de Instalación y EjecuciónPara correr este proyecto localmente, sigue estos pasos:Clonar el Repositoriogit clone [https://github.com/javierNiz11/tp2-2025-c2-examen.git](https://github.com/javierNiz11/tp2-2025-c2-examen.git)
cd tp2-2025-c2-examen
Instalar Dependenciasnpm install
Configurar Variables de EntornoCrea un archivo .env en la raíz del proyecto y añade las siguientes variables:MONGODB_URI=mongodb+srv://admin:tp2@cluster0.3bm3a.azure.mongodb.net/sample_airbnb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=3f1c2a84-9d4b-4c2b-b3f9-8c0b0c6b2e5a
PORT=3000
Ejecutar el ServidorPara iniciar el servidor en modo de desarrollo (con reinicio automático):npm run dev
El servidor estará corriendo en http://localhost:3000.Listado de Endpoints ImplementadosTodos los endpoints (excepto register y login) requieren un Token JWT válido enviado en el header Authorization: Bearer <token>.Endpoints de Autenticación y UsuariosPOST /api/users/registerDescripción: Registro de nuevos usuarios.Body (JSON):{
    "username": "tester",
    "email": "test@test.com",
    "password": "123456"
}
POST /api/users/loginDescripción: Login de usuarios existentes. Devuelve un token JWT.Body (JSON):{
    "email": "test@test.com",
    "password": "123456"
}
Endpoints de Listings (Base)GET /api/listingsDescripción: Obtener todas las propiedades (paginadas).Query Params (opcionales):page=[num] (default: 1)pageSize=[num] (default: 10)GET /api/listings/:idDescripción: Obtener una propiedad específica por su _id.Endpoints de Listings (Nuevas Tareas)Los siguientes endpoints fueron desarrollados para cumplir con las tareas asignadas.1. Obtener propiedades por tipo de alojamientoRuta: GET /api/listings/property-type/:typeDescripción: Retorna todas las propiedades que coincidan con el tipo especificado (ej: "Apartment", "House").Query Params (paginación):page=[num] (default: 1)pageSize=[num] (default: 10)2. Obtener propiedades con precio total calculadoRuta: GET /api/listings/with-total-priceDescripción: Retorna todas las propiedades con una nueva propiedad totalPrice (price + cleaning_fee + security_deposit + extra_people).Query Params (paginación):page=[num] (default: 1)pageSize=[num] (default: 10)3. Obtener propiedades por host específicoRuta: GET /api/listings/host/:host_idDescripción: Retorna todas las propiedades que pertenecen al host_id especificado.Query Params (paginación):page=[num] (default: 1)pageSize=[num] (default: 10)4. Actualizar la disponibilidad de una propiedadRuta: PATCH /api/listings/:idDescripción: Permite actualizar parcialmente los campos de disponibilidad de una propiedad.Body (JSON): Debe enviar un objeto solo con los campos a actualizar.{
    "available_30": 15,
    "available_90": 45
}
5. Obtener ranking de hosts con más propiedadesRuta: GET /api/listings/top-hostsDescripción: Retorna un ranking de los hosts que tienen más propiedades listadas, ordenado de mayor a menor.Query Params (opcionales):limit=[num] (default: 10)