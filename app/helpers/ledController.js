import { led } from "./led.js";
import  color from "./ledColors.js";
//controlador de led RGB, basicamente se dedica a cambiar la configuración del Led RGB dependiendo del valor de las variables guardados en el almacenamiento local del navegador
export async function ledController(device){
    let info,bool,alarm, temperatureWarning, humidityWarning, gasWarning,conection;
    //las variables indica el estado a la que está la aplicación (alarma, alerta o funcionamiento normal)
    //la configuración del led RGB se modifica dependiendo de estos estados
    alarm=localStorage.getItem('alarm');
    temperatureWarning=localStorage.getItem('temperatureWarning');
    humidityWarning=localStorage.getItem('humidityWarning');
    gasWarning=localStorage.getItem('gasWarning');
    conection=localStorage.getItem('conexion');
    console.log(`conection:${conection} ,alarm.${alarm}`);

    if(conection=='on'){
        info=await device.led.read();
        console.log(info);
        console.log(color.greenLed);
        console.log(`alarm:${alarm},temperatureWarning:${temperatureWarning},humidityWarning:${humidityWarning},gasWarning:${gasWarning} `);
        //activación de alarma
        if(alarm=='on'){
            bool=await led(device,color.redLed);            
        }//activación de alerta
        else if((alarm=='off')&&(temperatureWarning=='on'||humidityWarning=='on'||gasWarning=='on')){
            bool=await led(device,color.purpleLed);
        }//funcionamiento normal
        else if((alarm=='off')&&(temperatureWarning=='off'||humidityWarning=='off'||gasWarning=='off')){
            bool=await led(device,color.greenLed);
            console.log("ejecutando");
            console.log(bool);
        }
    }
}