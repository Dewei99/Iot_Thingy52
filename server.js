/*import { dirname,join } from "path";
import express from "express";
import { fileURLToPath } from "url";*/
const express = require('express');
const path = require('path');
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const PassportLocal= require('passport-local').Strategy;
const mongoose = require('mongoose');

//dotenv es un módulo de dependencia cero que carga variables de entorno de un archivo en process.env.
require('dotenv').config();

//const fileURLToPath=require('url');
const app = express();

//para poder recibir correctamente los datos enviado en el lado del cliente 
app.use(express.json());

// static files
app.use("/app",express.static(path.resolve(__dirname,"app")));

//Conexion a base de datos
const uri=`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ftd5eru.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;//url de conexion

/*mongoose.connect(uri,
    {useNewUrlParser:true, useUnifiedTopology:true}
).then(()=>console.log("Base de datos conectada"))
.catch(e=>console.log(e));*/

const Sensor = require('./models/sensor');
const sensorController = require('./controllers/sensorController')

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


//const __dirname = dirname(fileURLToPath(import.meta.url));
//asociar motor de plantilla a express, en concreto ejs
//app.set('view engine','hbs');//asignar un nombre de la configuración al valor
//app.set("views", __dirname + "/views");

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

//para todas las direcciones
/*app.get("/*",async(request,response,next)=>{
    response.sendFile(path.resolve(__dirname,"views","index.html"));
});*/

/*app.get("/",(req,res,next)=>{
        if(req.isAuthenticated()) return next();
        res.redirect("/login");
        console.log("server a /.fail");
    },(request,response)=>{
    response.redirect("/");
    console.log("server a /.");
    //response.sendFile(path.resolve(__dirname,"views","index.html"));
 });*/

/*app.get("/",(request,response)=>{
    //Si ya iniciamos mostrar bienvenida
    //console.log(__dirname);
    //Si no hemos iniciado sesión redireccionar a /login
    response.sendFile(path.resolve(__dirname,"views","index.html"));
    console.log("hola /");
    if(request.isAuthenticated()){
        console.log("server a /");
        response.redirect("/login");
    }else{
        response.redirect("/login");
    }
});*/
app.get("/",(req,res,next)=>{
    console.log("hola /");
    console.log('Cookies: ', req.cookies);
    //console.log(document.cookie);
    //res.sendFile(path.resolve(__dirname,"views","index.html"));
    if(req.isAuthenticated()){
        console.log("conectado usuario");
        res.sendFile(path.resolve(__dirname,"views","index.html"));
        console.log(req.user);
    }else{
        res.redirect("/login");
    }
    //res.redirect("/login");
    //next();
    //console.log("server a /.fail");
}
);
app.get("/login",(request,response)=>{
    console.log("hola /login");
    //response.send("hola");
    response.sendFile(path.resolve(__dirname,"views","index.html"));
    //Mostrar el formulario de login
    //console.log("hola /login");

});

app.get("/database",async (request,response)=>{
    try {
        console.log("hola /databases");
        //response.sendFile(path.resolve(__dirname,"views","index.html"));
        if(request.isAuthenticated()){
            console.log("conectado usuario");
        }else{
            response.redirect("/login");
        }
        
        if(request.isAuthenticated()){
            const arraySensores = await Sensor.find();
            /*console.log("DataBase:");
            console.log(arraySensores);
            console.log(arraySensores[0]._id);
            console.log(arraySensores[0]._id.toString());*/
            response.json(arraySensores);
        }

    } catch (error) {
        console.log(error);
    }

});

/*app.get("/*",(request,response)=>{
    response.sendFile(path.resolve(__dirname,"views","index.html"));
 });*/

app.post("/login",
    //Recibir credenciales e iniciar seseón

    passport.authenticate('local',{
        //successRedirect:"/",
        failureRedirect:"/login"
    }),function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log(req.user);
        res.redirect("/");
      }
    /*if(request.isAuthenticated()){
        console.log("server a /");
        response.redirect("/login");
    }*/
    //response.redirect("/");
);

//borrar datos de la base de datos
app.get('/delete/:id',
    sensorController.borrar
    /* console.log(req.params.id);
    res.json({success:true});*/
);

//guardar datos a la base de datos
app.post('/save',  sensorController.crear/*function(req, res) {
    //res.json({ message: 'hey' });
    console.log(req);
    res.status(400).end();
    console.log("estoy en /save");
    
}*/);

//enviar información de usuario al cliente
app.get('/user',  function(req, res) {
    if(req.isAuthenticated()){
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

app.listen(process.env.PORT||3000,()=>console.log("Server started"));