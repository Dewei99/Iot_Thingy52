import { BotonMenu } from "./Components/BotonMenu.js";
import { Title } from "./Components/Title.js";
import { Logo } from "./Components/Logo.js";
import {funcionMenu} from "./helpers/funcionMenu.js";
import { PanelMenu } from "./Components/PanelMenu.js";
import { Battery } from "./Components/Battery.js";
import { Temperature } from "./Components/Temperature.js";
import { Humidity } from "./Components/Humididy.js";
import { Btn_Conexion } from "./Components/Boton_Conexion.js";
import { Loader } from "./Components/Loader.js";
import {GasSensor} from "./Components/GasSensor.js";
import { AlarmScreen } from "./Components/AlarmScreen.js";
import { Btn_Alarma } from "./Components/Boton_Alarma.js";

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
     $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu");
    //let audioState=false;//esta variable se va a utilizar para activar o desactivar el envio de datos de audio al dispositivo
   // $root.appendChild(Title());



    $header.appendChild(BotonMenu());
    $header.appendChild(Logo());
    $header.appendChild(Title());
    $header.appendChild(Loader());
    //$header.appendChild(Battery(thingy));
    //$header.insertAdjacentElement("beforeend",Loader());
    //console.log(d.querySelector(".loader"));
    $aside.appendChild(PanelMenu());
    

    const thingy=Btn_Conexion(".conectar");
    //Btn_Alarma(thingy,"/Iot_Thingy52/app/assets/pcm0808m.wav");

    $header.appendChild(Battery(thingy));


    console.log(thingy);
    $main.appendChild(AlarmScreen());
    $main.appendChild(Temperature(thingy,".btn-temperature"));
    $main.appendChild(Humidity(thingy,".btn-humidity"));
    $main.appendChild(GasSensor(thingy,".btn-gas"));
    //Btn_Alarma(thingy,".btn-alarm1","/Iot_Thingy52/app/assets/pcm0808m.wav");
    Btn_Alarma(thingy,".btn-alarm1","/Iot_Thingy52/app/assets/alarm.wav");

    //funciones helpers
    funcionMenu(".panel-btn",".panelMenu");
    /*audioState=true;
    console.log(`audioState: ${audioState}`);*/
}