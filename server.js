
const express = require('express');
const path = require('path');
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const PassportLocal= require('passport-local').Strategy;
const mongoose = require('mongoose');
const IFTTT = require('ifttt-webhooks-channel')


//dotenv es un módulo de dependencia cero que carga variables de entorno de un archivo en process.env.
require('dotenv').config();

// Crear una nueva instancia de IFTTT
const ifttt = new IFTTT(`${process.env.KEY}`);// la clave de mi canal de webhooks

//const fileURLToPath=require('url');
const app = express();

//para poder recibir correctamente los datos enviado en el lado del cliente 
app.use(express.json());

// static files que se envía al lado del cliente junto con el archivo html
app.use(express.static("app"));

//Conexion a base de datos
const uri=`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ftd5eru.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;//url de conexion

//usar modelo y controlador para la interacción con MongoDB
const Sensor = require('./models/sensor');
const sensorController = require('./controllers/sensorController');
//usar modelo y controlador para la interacción con MongoDB
const RealTimeData = require('./models/realTimeData');
const realTimeDataController = require('./controllers/realTimeDataController');

//middleware, permite leer los datos enviado por un formulariowq2
app.use(express.urlencoded({extended:true}));
//configurar paquetes
app.use(cookieParser('mi secreto'));
//Configuración de la sesión
app.use(session({
    secret:'mi secreto',
    resave:true, //definir comportamiento de las sesiones,true(guardar aunque no se modifique la sesion)
    saveUninitialized: true 
}));

//middleware
app.use(passport.initialize());
//utilizar passport con sesiones
app.use(passport.session());

//para autenticarse con un nombre de usuario y contraseña.
//pasar un función de verificación, el done es el resultado de autenticación
passport.use(new PassportLocal(function(username,passWord,done){
    
    //si se cumple las condiciones, se inicia la sesión
    if(username===process.env.USER&& passWord===process.env.PASSWORD){

        mongoose.connect(uri,
            {useNewUrlParser:true, useUnifiedTopology:true}
        ).then(()=>console.log("Base de datos conectada"))
        .catch(e=>console.log(e));


        return done(null,{id:1,name:"Upm"});
        //1º argunto: error
        //2º argunto: usuario
        //3º argunto: opciones
    }
    //en caso de que no se cumpla lo anterior
    done(null,false);
}));

//configuracion de cómo se va a serializar(pasar objeto a un dato muy particular y pequeño) 
//o deserializar el usuario
//Serialización:
passport.serializeUser(function(user,done){
    done(null,user.id);//null=no hubo error
});

//deserializar
passport.deserializeUser(function(id,done){
    done(null,{id:1,name:"Upm"});//null=no hubo error
});

//ruta de vista de inicio
app.get("/",(req,res,next)=>{
    console.log("hola /");
    console.log('Cookies: ', req.cookies);
    if(req.isAuthenticated()){
        console.log("conectado usuario");
        //res.sendFile(path.resolve(__dirname,"views","index.html"));
        //enviar archivo html al lado del cliente
        res.sendFile(path.resolve(__dirname,"index.html"));
       // res.sendFile(path.resolve(__dirname,"app","index.html"));
        console.log(req.user);
    }else{
        //redirigir a inicio de sesión
        res.redirect("/login");
    }
}
);

//ruta de inicio de sesión
app.get("/login",(req,res)=>{
    console.log("hola /login");
    //ressendFile(path.resolve(__dirname,"views","index.html"));
    //enviar archivo html al lado del cliente
    res.sendFile(path.resolve(__dirname,"index.html"));
    //res.sendFile(path.resolve(__dirname,"app","index.html"));
});
//solitar todos los datos guardados en la base de datos
app.get("/database",async (request,response)=>{
    try {
        console.log("hola /databases");
        //response.sendFile(path.resolve(__dirname,"views","index.html"));
        if(request.isAuthenticated()){
            console.log("conectado usuario");
        }else{
            response.redirect("/login");
        }
        //autentificación de usuario
        if(request.isAuthenticated()){
            //buscar datos guardados en la base de datos
            const arraySensores = await Sensor.find();
            //enviar datos al lado de cliente
            response.json(arraySensores);
        }

    } catch (error) {
        console.log(error);
    }

});

//solitar datos de sensores de modo remoto guardado en la base de datos
app.get("/remote",async (request,response)=>{
    try {
        console.log("hola /databases");
        if(request.isAuthenticated()){
            console.log("conectado usuario");
        }else{
            response.redirect("/login");
        }
        //autentificación de usuario
        if(request.isAuthenticated()){
            //buscar datos guardados en la base de datos
            const arraySensores = await RealTimeData.find();
            //enviar datos al lado de cliente
            response.json(arraySensores);
        }
    } catch (error) {
        console.log(error);
    }
});

app.post("/login",
    //Recibir credenciales e iniciar seseón
    passport.authenticate('local',{
        //successRedirect:"/",
        failureRedirect:"/login"
    }),function(req, res) {
            // Si se llama a esta función,y la autenticación fue exitosa.
          // `req.user` contiene el usuario autenticado.
        console.log(req.user);
        res.redirect("/");
      }

);

//borrar datos de la base de datos
app.get('/delete/:id',
    sensorController.borrar
);

//guardar datos a la base de datos
app.post('/save',  sensorController.crear);

//compartir datos
app.post('/share',  realTimeDataController.crearRTD);
//actualizar datos compartidos
app.post('/update',  realTimeDataController.editarRTD);
//buscar dato
app.get('/findOne/:id', realTimeDataController.findOne);
//eliminar datos compartidos
app.get('/deleteShare/:id',realTimeDataController.borrarRTD);

//enviar información de usuario al cliente
app.get('/user',  function(req, res) {
    if(req.isAuthenticated()){
        console.log(req.user);
        //enviar datos al lado de cliente
        res.json(req.user);
    }
});

app.get('/sensors',  function(req, res) {
    console.log(req.params.id);

});

//cerrar sesión
app.get('/signout',  function(req, res, next) {
    req.logout(function(err) {
        console.log("estoy en logOut");
        if (err) { return next(err); }
        res.redirect('/')
    })
});

app.post('/ifttt',(req, response)=>{
    //IFTTT
    ifttt.post(req.body.event, [
        req.body.event,
        req.body.alert,
        req.body.value
    ])
    .then(res => {
        console.log(res);
        //enviar mensaje al lado de cliente
        response.json({ message: 'enviado aviso correctamente' }); })
    .catch(err => {console.error(err);
        response.status(500).json({
            message: 'Error al enviar aviso',
            status:501
        })
    });

});
//se indica el puerto a la que está conectado
app.listen(process.env.PORT||3000,()=>console.log("Server started"));