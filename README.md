# Aplicación de control de la calidad del ambiente interior 
Este proyecto se trata de una aplicación web de monitoreo en vivo de calidad del ambiente interior usando Nordic Thingy 52. La aplicación proporciona lecturas en vivo de los sensores Thingy 52 activados. Los datos recopilados por el kit de sensores se procesan y se presentan al usuario como una gráfica en vivo. También permite acceder y guardar los datos en MongoDB. Además, mientras el dispositivo que está recopilando datos de sensores del dispositivo Thingy 52, el usuario puede acceder a la lectura de los sensores desde otro dipositivo (móvil, table, etc) en cualquier lugar, permitiendo así que el usuario tenga acceso a los datos que se está recopilando sin tener que estar cerca del dispositivo Thingy 52. Esta aplicación también permite conectarse al servicio web IFTTT para avisar al usuario por correo electrónico cuando los valores de lectura de los sensores sean demasiado alto y puedan suponer un riesgo para la salud.

## Directorio del proyecto
~~~
Iot_Thingy52
|- app
   |- assets
   |- Components
   |- helpers
   |- lib
   |- stylesCSS
|- controllers 
|- models 
|- node_modules
~~~
- app: estarán los archivos estáticos(css, javascripts, imágenes,etc). Esta carpetá estática se cargará en el lado del cliente o navegador
- assets: estarán las imágenes y audios
- Components: se guardan los diferentes componentes que se can a renderizar en la interfaz de usuario
- helpers: códigos auxiliares que se dedica a resolver tareas particulares. 
- lib: uso de librería de Nordic Thingy 52
- stylesCSS: archivos que dan estilos al documento html
- controllers: controladores utilizado para crear, editar, buscar y eliminar datos de MongoDB
- models: archivos donde se define la estructura de datos que se almacenan en MongoDB
- node_modules: modulos descargados en el proyecto
## Librería
Para realizar este proyecto se ha utilizado la librería de Nordic thingy 52, accesible en el siguiente enlace: 
[libreria Thingy 52](https://github.com/NordicPlayground/Nordic-Thingy52-Thingyjs)
## Render
En la realización de este proyecto se ha desplegado la aplicación en Render. Pueden utilizar otras plataformas de servicios en la nube como Heroku. Tengan en cuenta que en el archivo `server.js` tendrá que modificar las variables de entorno como el nombre de usuario `process.env.USER`, la contraseña de usuario `process.env.PASSWORD` y el puerto a la que está conectado `process.env.PORT`.
Si quiere probar la aplicación web con el servidor local de Visual Studio Code, introduzca lo siguiente en la línea de comandos de VS Code para ejecutar la aplicación en el navegador:
`node server.js`
## Base de datos MongoDB
Se a utilizado la base de datos MongoDB para guardar los datos. Tenga en cuenta que tendrá que modificar en el archivo `server.js` la `uri` para poder conectarse a su base de datos. La uri es el identificador uniforme de recursos.
## IFTTT
Se ha utilizado el servicio web IFTTT para poder mandar avisos por correo electrónico al usuario. Tendrán que crear sus propios Applets utilizando Webhook, también tendrán que modificar en el archivo `server.js` el key de tu Webhook `process.env.KEY`. Para buscar tu key de Webhook solo hay que introducir Webhook en el buscardor de IFTTT y dar a setting, el key aparecerá al final de la URL. Los eventos utilizados en IFTTT son los siguiente: `sensor`, cuando la lectura de algún sensor supera un valor límite, y `alarma`, cuando el sensor de movimiento detecta que se ha movido el dispositivo Nordic Thingy 52.
