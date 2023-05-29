import { motionSensors } from "../helpers/motionSensors.js";

//Función de botón alarma
export function AlarmButton(thingy, boton, wavFile){

    const d=document,$boton=d.querySelector(boton), $screen=d.querySelector("alarm");
    let estado=0;

    //función activar botón
    async function start_Alarm(device) {
        try{
            //activar sensores de movimiento
            motionSensors(device, wavFile);
            $boton.classList.add("is-active");
            estado=1;
        
        } catch(error){
            console.error(error);
            console.log("no conectado");
        }
    }

    //función para botón
    async function stop_Alarm(device) {
        try{
            let bool=await device.rawdata.stop();

            $boton.classList.remove("is-active");
            estado=0;
        } catch(error){
            console.error(error);
        }
    }

    //esperar evento de click con el ratón
    d.addEventListener("click", async function(e){

        //pulsado botón de alarma
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){
            let alarm=localStorage.getItem('alarm');
            if((estado===0)&&(thingy.connected===true)){
                //activar alarma
                start_Alarm(thingy);
                console.log("pulsado btn de alarma");
            }else if((estado===1)&&(alarm=='off')){
                //para alarma
                stop_Alarm(thingy);
                localStorage.setItem('audioState', 'false');
            }else{
                //error
                console.log(`error estado:${estado} y conexion:${thingy.connected}`);
            }          
        }   
    });

}