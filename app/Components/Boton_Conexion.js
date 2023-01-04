
import { led } from "../helpers/led.js";
import  greenLed from "../helpers/ledColors.js";
import  blueLed from "../helpers/ledColors.js";
import { motionSensors } from "../helpers/motionSensors.js";
import Thingy from "../lib/Thingy.js";
import { Loader } from "./Loader.js";

export function Btn_Conexion(btnConexion){
    
    const d=document, $btn_conectar=d.querySelector(btnConexion), $title=d.querySelector(".title");
    const thingy = new Thingy({logEnabled: true});
    let estado_conexion=false;

    async function start(device) {
        try{
            $btn_conectar.appendChild(Loader());
            //seleccionar todos los loaders
            const $loader=d.querySelectorAll(".loader");
            $loader.forEach((el)=>{el.style.display="block"});

            const state=await device.connect();
            if(state===true){
                //quitar visivilidad a los loaders            
                $loader.forEach((el)=>{el.style.display="none"});
                $btn_conectar.innerHTML="Desconectar";
                estado_conexion=true;
                $btn_conectar.classList.toggle("is-active");
                $title.innerHTML='Thingy:52 - Conectado';
                //motionSensors(thingy);
                //configurar led
                led(thingy,greenLed);

            }else{

                $loader.forEach((el)=>{el.style.display="none"});
            }

        }catch (error) {
            console.error(error);
        }
    }

    async function stop(device) {
        try{

            $btn_conectar.appendChild(Loader());
            const $loader=d.querySelectorAll(".loader");
            $loader.forEach((el)=>{el.style.display="block"});

            //apagar todos los sensores
            //await device.temperature.stop();
            led(thingy,blueLed);
            const state=await device.disconnect();
            if(state===true){            
                $loader.forEach((el)=>{el.style.display="none"});
                $btn_conectar.innerHTML="Conectar";
                estado_conexion=false;
                $btn_conectar.classList.toggle("is-active");
                $title.innerHTML='Thingy:52 - Desconectado';
                location.reload();
                //apagar todos los sensores
                //await device.temperature.stop();
            }else{

                $loader.forEach((el)=>{el.style.display="none"});
            }

        }catch (error) {
            console.error(error);
        }
    }

    $btn_conectar.addEventListener("click", async () => {
        if(estado_conexion===false){
            start(thingy);
        }else if(estado_conexion===true){
            stop(thingy);
        }
    });

    return thingy;

}