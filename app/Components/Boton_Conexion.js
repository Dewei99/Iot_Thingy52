
import Thingy from "../lib/Thingy.js";
import { Loader } from "./Loader.js";

export function Btn_Conexion(btnConexion){
    
    const d=document, $btn_conectar=d.querySelector(btnConexion), $title=d.querySelector(".title");
    const thingy = new Thingy({logEnabled: true});
    let estado_conexion=false;

    async function start(device) {
        try{
            $btn_conectar.appendChild(Loader());
            const $loader=d.querySelectorAll(".loader");
            $loader.forEach((el)=>{el.style.display="block"});

            const state=await device.connect();
            if(state===true){            
                $loader.forEach((el)=>{el.style.display="none"});
                $btn_conectar.innerHTML="Desconectar";
                estado_conexion=true;
                $btn_conectar.classList.toggle("is-active");
                $title.innerHTML='Thingy:52 - Conectado';
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
            const state=await device.disconnect();
            if(state===true){            
                $loader.forEach((el)=>{el.style.display="none"});
                $btn_conectar.innerHTML="Conectar";
                estado_conexion=false;
                $btn_conectar.classList.toggle("is-active");
                $title.innerHTML='Thingy:52 - Desconectado';
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