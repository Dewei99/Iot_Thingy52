
import { getAjax } from "../helpers/getAjax.js";
import { led } from "../helpers/led.js";
import  blueLed from "../helpers/ledColors.js";
import { ledController } from "../helpers/ledController.js";
import { navigateTo } from "../helpers/navigateTo.js";
import Thingy from "../lib/Thingy.js";
import { Loader } from "./Loader.js";

//Da funcionalidad al botón renderizado en la aplicación
export function ConectionButton(btnConexion){
    const d=document, $btn_conectar=d.querySelector(btnConexion), $title=d.querySelector(".title");
    const thingy = new Thingy({logEnabled: false}),$error=d.querySelector(".error");
    let estado_conexion=false, info;
    localStorage.setItem('conexion', 'off');
    
    //función conexión al dispositivo thingy 52 por BLE
    async function start(device) {
        try{
            $btn_conectar.appendChild(Loader());
            //seleccionar todos los loaders
            const $loader=d.querySelectorAll(".loader");
            $loader.forEach((el)=>{el.style.display="block"});

            //buscar conexión al dispositivo thingy 52 
            const state=await device.connect();
            if(state===true){
                //quitar visivilidad a los loaders            
                $loader.forEach((el)=>{el.style.display="none"});
                //Texto del botón cambia de conectar a desconectar
                $btn_conectar.innerHTML="Desconectar";
                estado_conexion=true;
                //Cambiar color del botón
                $btn_conectar.classList.toggle("is-active");
                //Mostrar en la intefaz de la aplicación que se ha conectado al dispositivo
                $title.innerHTML='Thingy:52 - Conectado';
                info = await device.led.read();
                console.log(info);
                localStorage.setItem('conexion', 'on');
                localStorage.setItem('alarm', 'off');
                await ledController(device);

                //limpiar los datos que se están compartiendo en modo remoto
                getAjax("/realTimeData",function(data){
                    data.forEach(el => {
                        getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir datos");
                                }
                        },function(error){
                            console.log(error);
                        }
                        );
                    });
                });
            }else{
                $loader.forEach((el)=>{el.style.display="none"});
            }

        }catch (error) {
            console.error(error);
        }
    }
    //función parar la conexión al dispositivo thingy 52 por BLE
    async function stop(device) {
        try{
            $btn_conectar.appendChild(Loader());
            const $loader=d.querySelectorAll(".loader");
            $loader.forEach((el)=>{el.style.display="block"});

            await led(device,blueLed);
            const state=await device.disconnect();
            if(state===true){
                //eliminar datos compartidos en modo remoto
                getAjax("/realTimeData",function(data){
                    data.forEach(el => {
                        getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir datos");
                                }
                        },function(error){
                            console.log(error);
                        });
                        
                    });
                });
                navigateTo("/");
                localStorage.setItem('error', 'off');
                $error.classList.remove("is-active");
                $loader.forEach((el)=>{el.style.display="none"});
                //Texto del botón cambia de desconectar a conectar
                $btn_conectar.innerHTML="Conectar";
                estado_conexion=false;
                $btn_conectar.classList.toggle("is-active");
                //Mostrar en la intefaz de la aplicación que no está conectado al dispositivo
                $title.innerHTML='Thingy:52 - Desconectado';
                localStorage.setItem('conexion', 'off');
                //recargar página
                location.reload();
            }else{
                $loader.forEach((el)=>{el.style.display="none"});
            }

        }catch (error) {
            console.error(error);
        }
    }

    //esperar evento de click con el ratón
    $btn_conectar.addEventListener("click", async () => {
        //click en el botón conectar 
        if(estado_conexion===false){
            //empezar la conexión al dispositivo
            start(thingy);
        }else if(estado_conexion===true){
            //parar la conexión al dispositivo
            stop(thingy);
        }
    });

    return thingy;

}