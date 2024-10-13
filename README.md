# ESTE NO ES EL REPOSITORIO DEL PROYECTO FINAL!!!
POR FAVOR REDIRIJIRSE ACÁ https://github.com/scerminati/BE2_PF_cerminati

# Backend II - Pre Entrega 1 - Sofía Cerminati

Este proyecto es la programación del Backend del E-Commerce So-Games, para juegos de mesa, junto con la implementación de su FrontEnd. El mismo se realiza como finalización del curso Programación Backend II: Diseño y Arquitectura Backend de CODERHOUSE, comisión 70070, con el profesor Omar Jesús Maniás. 

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Servidor](#servidor)
3. [Routers](#routers)
4. [Endpoints](#endpoints)
5. [Mongoose y Modelos](#mongoose-y-modelos)
6. [Multer y subida de archivos](#multer-y-subida-de-archivos)
7. [Utils](#utils)
8. [Sesión, Autenticación y Autorización](#sesión-autenticación-y-autorización)
9. [Visualización y Gestión de E-Commerce en FrontEnd](#visualización-y-gestión-de-e-commerce-en-frontend)
10. [Esqueleto del Proyecto](#esqueleto-del-proyecto)
11. [Recursos Utilizados](#recursos-utilizados)

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/scerminati/BE2_PE1_Cerminati.git
```

2. Navegar al directorio del repositorio

```bash
cd BE2_PF1_Cerminati
```

3. Instalar las dependencias

```bash
npm install
```

4. Iniciar la aplicación

```bash
npm start
```

## Servidor

El servidor está configurado para ejecutarse en _localhost_ en el puerto _8080_. Una vez que la aplicación esté inicializada con el comando `npm start`, se puede visualizar el proyecto en un navegador con el siguiente link:

- **http://localhost:8080/**

## Routers

La aplicación cuenta con cuatro routers: _products_, _carts_, _sessions_ y _views_.

- **Products**: Contiene los métodos **GET**, **POST**, **PUT** y **DELETE** para la gestión de productos.
- **Carts**: Incluye los métodos **GET**, **POST**, **PUT** y **DELETE** para la gestión de carritos.
- **Sessions**: Permite el registro, inicio de sesión y autentificación del usuario dentro del sitio. Incluye los métodos **GET** y **POST**.
- **Views**: Permite renderizar la información en pantalla usando Handlebars mediante el método **GET**.

## Endpoints

### Products

- **GET**: El endpoint permite obtener el listado completo de los productos con todo su detalle. Si se especifica un id, **/api/products/_id_**, el método mostrará el producto con dicho id si existe tal. Asimismo, al especificar un límite como pedido con **/api/products/?limit=_X_**, se devuelve el listado de productos limitados en cantidad _X_.

- **POST**: El endpoint permite agregar un nuevo producto. El id del nuevo producto se define solo, de manera que no se repita con ninguno de los anteriores. El método también toma como obligatorios los campos de título, código, descripción, stock y categoría, así como también el tipo de dato que se ingresa. Si stock pasa a tener un valor de 0, el status se añadirá al producto como _false_, de lo contrario, siempre será _true_. En cuanto a thumbnail, espera recibir un string, pero el ingreso de dicho dato no es necesario. En caso de no recibirlo o recibir otro tipo de dato (como numérico), se completará como un string vacío. Una vez realizado el método, se actualiza el archivo en la carpeta json. El método debe ejecutarse en la raíz de la api, **/api/products/**.

- **PUT**: Este endpoint permite modificar cualquiera de los productos que se encuentran en la base de datos especificando el id del mismo mediante **/api/products/_id_**. El método buscará los datos a cambiar y solo cambiará los mismos, sin necesidad de volver a escribir todo el producto, o lo que se desea dejar igual. En caso de que el producto no exista, devolverá un error _404_.

- **DELETE**: El endpoint busca el producto mediante la especificación del id **/api/products/_id_**, y elimina el producto del array, actualizando el archivo al hacerlo.

### Carts

- **GET**: El endpoint permite obtener el listado completo de los carritos con el detalle de id y los productos dentro de ellos, especificando id y cantidad. Si se especifica un id, **/api/carts/_id_**, el método mostrará el carrito con dicho id si existe. Asimismo, al especificar un límite como pedido con **/api/carts/?limit=_X_**, se devuelve el listado de carritos limitados en cantidad _X_. Adicionalmente se añade **/api/carts/_id_/QT** para poder manejar los cambios en el carrito y obtener la cantidad de productos totales en él, para visualizarlo en los handlebars.

- **POST**: El endpoint debe ejecutarse en la raíz **/api/carts**, y generará un nuevo carrito con un id asignado automáticamente. El mismo se guardará en el archivo .json y generará el array de productos vacíos para luego ser añadidos.

- **PUT**: El endpoint necesita dos parámetros: el id del carrito y el id del producto a agregar. Se debe ejecutar en la ruta **/api/carts/_idCarrito_/product/_idProducto_**. Ambos ids deben ser válidos y existir en los arrays correspondientes. Si tanto el id como el producto existen, se verifica primero que el status del producto sea **_true_**, lo cual implica que hay stock disponible. En caso de que sea falso, se arroja un error _404_. Si hay stock, se agrega a cantidades del producto de a 1, generando un nuevo objeto de producto con el id del producto en caso de que no exista, y sumando una cantidad de 1 si ya existe. A medida que se agregan productos, se van descontando del array de productos la misma cantidad en stock. En caso de que el stock llegue a 0, el método arroja un error _404_ avisando que no hay más stock para agregar.

- **DELETE**: El endpoint permite el distintas combinaciones de parámetros para resolver la consulta. Si se pasa **/api/carts/_idCarrito_/product/_idProducto_**, se elimina dicho producto del carrito, devolviendo así el stock original a la base de datos de producto. Por otro lado, si se pasa **/api/carts/_idCarrito_**, se eliminarán todos los productos dentro del carrito seleccionado, no así el carrito, permitiendo la persistencia y continuar con la compra si así se desea.

### Sessions

- **GET**: El endpoint de `GET` de Sessions permite obtener los datos del usuario autenticado. 

  - **/current**: Envía los datos del usuario logeado una vez que se autentica la sesión del mismo al frontend.

- **POST**: Los siguientes endpoints habilitan el registro, logueo y autentificación del usuario a través de inserciones en la base de datos y verificaciones en la misma.

  - **/register**: Permite el registro del usuario verificando que el correo electrónico no se encuentre ya en la base de datos. Una vez que se crea el registro, el usuario tendrá un rol de `user` y un carrito se generará con id único.

  - **/login**: Permite el inicio de sesión siempre que se haya registrado el usuario previamente, si el inicio de sesión es exitoso, se genera un token que se almacena en las cookies.

  - **/logout**: Permite la finalización de la sesión, eliminando la cookie del navegador.

  - **/checkout**: Actualiza el estado del usuario, creando un nuevo carrito en su usuario y guardando el anterior. 

### Views

- **GET**: Los endpoints de `GET` permiten la visualización y renderización de las vistas utilizando Handlebars. A continuación se describen las vistas principales:

  - **/**: Renderiza la vista principal (_index.handlebars_) con la lista de productos. Implementa paginación, filtrado por categoría, y ordenación por precio. Se pueden pasar los siguientes parámetros de consulta:

    - `page`: Número de la página a visualizar. Por defecto es `1`.
    - `limit`: Límite de productos a mostrar por página. El valor máximo permitido es `10`.
    - `sort`: Ordenar los productos por precio. Valores posibles: `asc` (ascendente) o `desc` (descendente).
    - `category`: Filtrar los productos por una categoría específica.

  - **/products/:pid**: Muestra los detalles de un producto específico. Renderiza la vista _productDetail.handlebars_. El parámetro `:pid` corresponde al ID del producto.

  - **/realtimeproducts**: Renderiza la vista _realtimeproducts.handlebars_ que muestra todos los productos en tiempo real. La redirección debe estar autorizada, es decir, se verifica que el usuario logueado sea efectivamente un administrador.

  - **/carts/:cid**: Muestra el contenido de un carrito específico. Renderiza la vista _cart.handlebars_ con el detalle de los productos en el carrito, la cantidad de cada uno y el precio total del carrito. El parámetro `:cid` corresponde al ID del carrito. Autentica al usuario logeado antes de poder acceder a esta ruta.

  - **/login**: Redirecciona al usuario a la página de login, siempre y cuando este no esté logueado.

  - **/register**: Redirecciona al usuario a la página de registro, siempre y cuando no esté loguado.

  - **/profile**: Redirecciona al usuario a su perfil, si está logueado y autenticado mediante passport.

  - **/failedregister** y **/faillogin**: Redirecciona al usuario a una página de error, donde se espefica el mismo.

## Mongoose y Modelos

### Modelos de Datos

- **Product**: Define la estructura de los productos con los campos de título, código, descripción, stock, categoría y thumbnail.
- **Cart**: Define la estructura de los carritos, que incluye el array de productos y su cantidad. El array de productos, a su vez, es poblada por el modelo de _products_.
- **User**: Define la estructura de los usuarios para el registro de los mismos, asignando como rol por defecto de `user` y asignando un carrito.

### Conexión con MongoDB

La conexión a MongoDB se establece usando Mongoose en el archivo `app.js`, asegurando que la base de datos esté disponible para operaciones CRUD. La base de datos utilizada se llama _SoGames_.

### Paginado

Se utiliza Mongoose Paginate para realizar el paginado en el index a partir del modelo de _products_, el mismo permite ordenar de forma ascendente o descendente por precio, filtrar por categoría y limitar la cantidad de productos por página.

## Multer y subida de archivos

Multer se utiliza para manejar la subida de archivos en `realtimeproducts`. La configuración incluye la definición de almacenamiento y la validación del tipo de archivo permitido, en este caso, imagen. Adicionalmente permite visualizar el contenido antes de subir, y una vez almacenado, lo deja en la carpeta `/public/images`.

## Sesión, Autenticación y Autorización

Se utiliza `express-session` para mantener la sesión en MongoStore. Adicionalmente se utiliza `passport` y `JsonWebToken` como estatregia de autenticación y autorización a lo largo de la navegación del sitio, teniendo como objetivo principal no autorizar ciertos accesos y proteger la sesión del usuario así como también sus datos sensibles. Se utiliza `cookie-parser` para poder extraer los tokens generados en los inicios de sesión, y permite la navegación durante una hora sin cerrar la sesión de manera automática.

## Utils

El archivo `utils.js` contiene una serie de scripts y helpers diseñados para facilitar tareas comunes y operaciones en la aplicación. A continuación, se describen sus principales funcionalidades:

1. **Simulación de __dirname en Módulos ES**:  
   Dado que los módulos ES no soportan nativamente el valor `__dirname`, se ha implementado una solución que permite obtener el directorio actual del archivo. Esto es esencial para manejar rutas de forma consistente dentro del proyecto.

2. **Generación de IDs Incrementales (como método interno de uso de IDs)**:

   - **Para Productos (`getNextId`)**: Calcula el siguiente ID disponible para los productos, garantizando que cada nuevo producto tenga un ID único y secuencial. Este método asegura que los productos reciban IDs incrementales, lo que facilita la gestión y referencia de los mismos en la base de datos.
   - **Para Carritos (`getNextIdC`)**: Similar a la función anterior, pero aplicada a los carritos, asegurando que cada nuevo carrito tenga un ID único y secuencial. Esta metodología de asignación de IDs es útil para mantener la integridad y organización de los carritos en la base de datos.

   **Nota Importante**: En la aplicación, se utilizan los IDs generados automáticamente por la base de datos para la interacción entre las distintas vistas. Los métodos `getNextId` y `getNextIdC` se utilizan internamente para asegurar que los IDs sean únicos y secuenciales durante la creación de nuevos productos y carritos.

3. **Configuración de Multer para la Subida de Archivos**:  
   Se ha configurado `multer` para manejar la carga de archivos, especificando la carpeta de destino y validando que solo se permitan imágenes como tipo de archivo. Esto asegura que todos los archivos subidos cumplan con los requisitos de la aplicación.

4. **Helpers para Handlebars**:  
   Se incluyen helpers personalizados para Handlebars, que permiten realizar comparaciones y operaciones aritméticas básicas dentro de las plantillas.

## Visualización y Gestión de E-Commerce en FrontEnd

### Templates de Handlebars

- **index**: Permite acceder al listado completo de productos. Adicionalmente, al ingresar por primera vez, se genera un _idCart_ el cual se almacena en el local storage. Dicho valor permitirá la persistencia durante la visita del usuario.
- **cart**: Permite la visualización del carrito actual, dejando que el usuario pueda modificar cantidades y/o eliminar productos. Adicionalmente permite realizar un checkout, el mismo eliminará el _idCart_ del local storage, y abrirá uno nuevo cuando se ingrese nuevamente a la página. Este carrito queda almacenado en la base de datos, y no se podrá modificar las cantidades ni los productos desde la sesión nueva.
- **login**: Permite el inicio de sesión del usuario.
- **productDetail**: Visualización de los detalles del producto seleccionado. Permite también añadir al carrito. Si el producto ya se encuentra en el carrito, no permitirá modificar la cantidad. La misma se debe hacer desde la visualización del carrito.
- **profile**: Visualización de los datos básicos del usuario. 
- **realtimeproducts**: La aplicación cuenta con una funcionalidad en tiempo real que permite la visualización y gestión dinámica de productos desde una vista de administrador. Esta funcionalidad se implementa utilizando **Socket.io** para permitir la comunicación en tiempo real entre el servidor y el cliente, permitiendo eliminar, modificar y añadir productos en la base de datos.
- **register**: Habilita el registro de un usuario nuevo. 

## Esqueleto del Proyecto

```bash
BE2-PE1-Cerminati
├── src/
│   ├── config/
│   │   └── passport.config.js  # Configuración de Passport para autenticación
│   │
│   ├── middleware/
│   │   └── auth.js  # Middleware de autenticación
│   │
│   ├── models/
│   │   ├── cartModel.js  # Modelo de datos para carritos
│   │   ├── productModel.js  # Modelo de datos para productos
│   │   └── user.model.js  # Modelo de datos para usuarios
│   │
│   ├── public/
│   │   ├── images/  # Imágenes utilizadas en la aplicación
│   │   ├── js/  # Scripts utilizados en el FrontEnd
│   │   │   ├── cart.js  # Script para manejo del carrito
│   │   │   ├── index.js  # Script para listado de productos
│   │   │   ├── productDetail.js  # Script para detalles de producto
│   │   │   ├── realtimeproducts.js  # Script para gestión de productos en modo Administrador
│   │   │   └── utils.js  # Utilidades varias para el FrontEnd
│   │   └── styles/
│   │       └── styles.css  # Estilo principal de la aplicación
│   │
│   ├── router/
│   │   ├── cart.router.js  # Rutas para carritos
│   │   ├── products.router.js  # Rutas para productos
│   │   ├── session.router.js  # Rutas para sesiones y autenticación
│   │   └── views.router.js  # Rutas para vistas (handlebars)
│   │
│   ├── utils/
│   │   ├── cartUtils.js  # Utilidades relacionadas con carritos
│   │   ├── dirnameUtils.js  # Utilidad para manejo de __dirname
│   │   ├── errorHandler.js  # Manejo de errores
│   │   ├── handlebarsHelpers.js  # Helpers para Handlebars
│   │   ├── multerUtils.js  # Configuración de Multer para subir archivos
│   │   ├── passportUtils.js  # Utilidades para Passport
│   │   ├── passwordUtils.js  # Utilidades para manejo de contraseñas
│   │   ├── socketUtils.js  # Utilidades para Socket.io
│   │   ├── utils.js  # Otras utilidades
│   │   └── webTokenUtil.js  # Utilidad para manejo de Web Tokens
│   │
│   ├── views/
│   │   ├── admin/
│   │   │   └── realtimeproducts.hbs  # Plantilla para gestión de productos en modo Administrador
│   │   ├── error/
│   │   │   └── error.hbs  # Plantilla para mostrar errores
│   │   ├── layouts/
│   │   │   └── main.handlebars  # Plantilla base para vistas
│   │   ├── products/
│   │   │   └── productDetail.hbs  # Plantilla de detalle de producto
│   │   ├── users/
│   │   │   ├── cart.hbs  # Plantilla para manejo de carrito
│   │   │   ├── login.hbs  # Plantilla para el inicio de sesión
│   │   │   ├── profile.hbs  # Plantilla para el perfil del usuario
│   │   │   └── register.hbs  # Plantilla para el registro de usuario
│   │   └── index.hbs  # Plantilla para listado de productos
│   │
│   ├── app.js  # Archivo principal para iniciar la aplicación
│
├── .gitignore  # Archivos y carpetas a ignorar por Git
├── package.json  # Archivo de configuración de dependencias
└── README.md  # Archivo de documentación del proyecto                     

```

### Descripción de Carpetas y Archivos

### Descripción de Carpetas y Archivos

- **`src/config/`**: Archivos de configuración de la aplicación.
- **`src/middleware/`**: Middleware personalizado para la aplicación.
- **`src/models/`**: Modelos de datos que definen la estructura de la base de datos.
- **`src/public/`**: Archivos estáticos que se sirven al cliente.
- **`src/router/`**: Definición de rutas para la API y vistas del frontend.
- **`src/utils/`**: Scripts utilitarios y helpers.
- **`src/views/`**: Plantillas Handlebars para renderizar el frontend.
- **`src/app.js`**: Archivo principal que arranca el servidor y configura la aplicación.
- **`.gitignore`**: Especifica los archivos y carpetas que deben ser ignorados por Git.
- **`package.json`**: Contiene la configuración del proyecto y las dependencias.
- **`README.md`**: Proporciona documentación sobre el proyecto.


## Recursos Utilizados

Este proyecto utiliza las siguientes tecnologías y bibliotecas:

- **[Express](https://expressjs.com/)**: Un marco web para Node.js, utilizado para construir el backend.
  - Versión: `^4.19.2`
- **[Express Handlebars](https://handlebarsjs.com/)**: Motor de plantillas para generar vistas HTML dinámicas.
  - Versión: `^7.1.3`
- **[Multer](https://www.npmjs.com/package/multer)**: Middleware para manejar `multipart/form-data`, utilizado para la carga de archivos.
  - Versión: `^1.4.5-lts.1`
- **[Socket.io](https://socket.io/)**: Biblioteca para la comunicación en tiempo real entre el servidor y el cliente.
  - Versión: `^4.7.5`
- **[Mongoose](https://mongoosejs.com/)**: Biblioteca para la modelación de datos en MongoDB y la interacción con la base de datos.
  - Versión: `^8.5.1`
- **[Mongoose Paginate v2](https://www.npmjs.com/package/mongoose-paginate-v2)**: Plugin de Mongoose para agregar paginación a los esquemas de MongoDB.
  - Versión: `^1.8.3`
- **[Toastify](https://apvarun.github.io/toastify-js/)**: Biblioteca para mostrar notificaciones de estilo "toast".
  - Versión: `^1.12.0`
- **[Boxicons](https://boxicons.com/)**: Biblioteca de iconos para mejorar la interfaz de usuario.
  - Versión: `^2.1.2`
- **[Passport](http://www.passportjs.org/)**: Middleware de autenticación para Node.js.
  - Versión: `^0.7.0`
- **[Passport JWT](https://www.npmjs.com/package/passport-jwt)**: Estrategia de Passport para autenticación con JSON Web Tokens (JWT).
  - Versión: `^4.0.1`
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: Biblioteca para el hash y la verificación de contraseñas.
  - Versión: `^5.1.1`
- **[Connect-Mongo](https://www.npmjs.com/package/connect-mongo)**: Adaptador para almacenar sesiones en MongoDB.
  - Versión: `^5.1.0`
- **[Cookie-Parser](https://www.npmjs.com/package/cookie-parser)**: Middleware para analizar cookies en las solicitudes HTTP.
  - Versión: `^1.4.6`
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Carga variables de entorno desde un archivo `.env`.
  - Versión: `^16.4.5`
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Biblioteca para trabajar con JSON Web Tokens (JWT).
  - Versión: `^9.0.2`
