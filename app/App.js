import { MenuButton } from "./Components/MenuButton.js";
import { Title } from "./Components/Title.js";
import { Logo } from "./Components/Logo.js";
import {menuFunction} from "./helpers/menuFunction.js";
import { MenuPanel } from "./Components/MenuPanel.js";
import { Battery } from "./Components/Battery.js";
import { Temperature } from "./Components/Temperature.js";
import { Humidity } from "./Components/Humididy.js";
import { ConectionButton } from "./Components/ConectionButton.js";
import { Loader } from "./Components/Loader.js";
import {GasSensor} from "./Components/GasSensor.js";
import { AlarmScreen } from "./Components/AlarmScreen.js";
import { AlarmButton } from "./Components/AlarmButton.js";
import { ledController } from "./helpers/ledController.js";

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
     $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu");
    //let audioState=false;//esta variable se va a utilizar para activar o desactivar el envio de datos de audio al dispositivo
   // $root.appendChild(Title());



    $header.appendChild(MenuButton());
    $header.appendChild(Logo());
    $header.appendChild(Title());
    $header.appendChild(Loader());
    //$header.appendChild(Battery(thingy));
    //$header.insertAdjacentElement("beforeend",Loader());
    //console.log(d.querySelector(".loader"));
    $aside.appendChild(MenuPanel());
    

    const thingy=ConectionButton(".conectar");
    //Alarm_Btn(thingy,"/Iot_Thingy52/app/assets/pcm0808m.wav");

    $header.appendChild(Battery(thingy));


    console.log(thingy);
    $main.appendChild(AlarmScreen());
    $main.appendChild(Temperature(thingy,".btn-temperature"));
    $main.appendChild(Humidity(thingy,".btn-humidity"));
    $main.appendChild(GasSensor(thingy,".btn-gas"));
    //Btn_Alarma(thingy,".btn-alarm1","/Iot_Thingy52/app/assets/pcm0808m.wav");
    AlarmButton(thingy,".btn-alarm1","/Iot_Thingy52/app/assets/alarma.wav");

    //funciones helpers
    menuFunction(".panel-btn",".panelMenu");
    //ledController(thingy);

    /*audioState=true;
    console.log(`audioState: ${audioState}`);*/
}