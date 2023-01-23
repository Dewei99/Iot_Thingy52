/*import { dirname,join } from "path";
import express from "express";
import { fileURLToPath } from "url";*/
const express = require('express');
const path = require('path');
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const PassportLocal= require('passport-locl').Strategy;

//const fileURLToPath=require('url');
const app = express();

// static files
app.use("/app",express.static(path.resolve(__dirname,"app")));

//middleware, permite leer los datos enviado por un formulario
app.use(express.urlencoded({extended:true}));
//configurar paquetes
app.use(cookieParser('mi secreto'));

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
passport.use(new PassportLocal(function(username,password,done){
    
    //si se cumple las condiciones, se inicia la sesión
    if(username==="upm"&& password==="123456789"){
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

app.get("/",(request,response)=>{
    //Si ya iniciamos mostrar bienvenida
    console.log(__dirname);
    //Si no hemos iniciado sesión redireccionar a /login
});

app.get("/login",(request,response)=>{
    //Mostrar el formulario de login


});

app.post("/login",(request,response)=>{
    //Recibir credenciales e iniciar seseón
    
});

//para todas las direcciones
app.get("/*",(request,response)=>{
    response.sendFile(path.resolve(__dirname,"views","index.html"));
 });

app.listen(process.env.PORT||3000,()=>console.log("Server started"));