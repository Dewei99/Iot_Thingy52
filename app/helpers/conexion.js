
import Thingy from "../lib/Thingy.js";

export function conexion(btnConexion){
    const d=document;
    const thingy = new Thingy({logEnabled: true});

    async function start(device) {
        try{
            await device.connect();
        }catch (error) {
            console.error(error);
        }
       /* await device.temperature.start();
        await device.addEventListener("temperature", logData);*/
    }

    d.querySelector(btnConexion).addEventListener("click", async () => {
        start(thingy);
    });

    return thingy;
   /* d.addEventListener("click", e=>{
        if(e.target.matches(btnConexion)||e.target.matches(`${btnConexion} *`)){
            d.querySelector(panel).classList.toggle("is-active");
            console.log("hola");
        }
    
    });*/

}