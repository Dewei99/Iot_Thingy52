import { led } from "./led.js";
/*import   greenLed from "./ledColors.js";
import  redLed from "./ledColors.js";
import  yellowLed from "./ledColors.js";*/
import  color from "./ledColors.js";
export async function ledController(device){
    let info,bool,alarm, temperatureWarning, humidityWarning, gasWarning,conection;
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
        if(alarm=='on'){
            bool=await led(device,color.redLed);
        }else if((alarm=='off')&&(temperatureWarning=='on'||humidityWarning=='on'||gasWarning=='on')){
            bool=await led(device,color.purpleLed);
        }else if((alarm=='off')&&(temperatureWarning=='off'||humidityWarning=='off'||gasWarning=='off')){
            bool=await led(device,color.greenLed);
            console.log("ejecutando");
            //bool= await device.led.write(greenLed);
            console.log(bool);
            //console.log(greenLed);
        }
        /*setTimeout(async function(){

            leerData();
        },100);*/
        /*if(bool===undefined||bool===false){
            ledController(device);
        }*/
    }
    /*setInterval(async function(){
        alarm=localStorage.getItem('alarm');
        temperatureWarning=localStorage.getItem('temperatureWarning');
        humidityWarning=localStorage.getItem('humidityWarning');
        gasWarning=localStorage.getItem('gasWarning');
        conection=localStorage.getItem('conexion');
        console.log(`conection:${conection} ,alarm.${alarm}`);

        //await led(device,redLed);

        if(conection=='on'){
            info=await device.led.read();
            console.log(info);
            console.log(`alarm:${alarm},temperatureWarning:${temperatureWarning},humidityWarning:${humidityWarning},gasWarning:${gasWarning} `);
            if(alarm=='on'){
                await led(device,redLed);
            }else if((alarm=='off')&&(temperatureWarning=='on'||humidityWarning=='on'||gasWarning=='on')){
                await led(device,yellowLed);
            }else if((alarm=='off')&&(temperatureWarning=='off'||humidityWarning=='off'||gasWarning=='off')){
                await led(device,greenLed);
                console.log("ejecutando");
            }
        }
    }, 1000);*/

}