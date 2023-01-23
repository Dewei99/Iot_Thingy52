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
import { router } from "./helpers/router.js";
import { navigateTo } from "./helpers/navigateTo.js";
import { LoginIn } from "./Components/LoginIn.js";
import { ProfilePicture } from "./Components/ProfilePicture.js";

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
    $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu"),$asideAlarm=d.querySelector(".panelAlarm"), 
    $sensores = d.createElement("div"),$thingyHeader = d.createElement("div"),$profileHeader= d.createElement("div"),
    $dataBase = d.createElement("div");
    $sensores.classList.add("sensores");
    $dataBase.classList.add("dataBase");
    $thingyHeader.classList.add("thingyHeader");
    $profileHeader.classList.add("profileHeader");
    $dataBase.innerHTML=`base de dato`;
     //let audioState=false;//esta variable se va a utilizar para activar o desactivar el envio de datos de audio al dispositivo
   // $root.appendChild(Title());

    $thingyHeader.appendChild(MenuButton());
    $thingyHeader.appendChild(Logo());
    $thingyHeader.appendChild(Title());
    $thingyHeader.appendChild(Loader());

    $profileHeader.appendChild(ProfilePicture());

    /*$header.appendChild(MenuButton());
    $header.appendChild(Logo());
    $header.appendChild(Title());
    $header.appendChild(Loader());*/
    //$header.appendChild(Battery(thingy));
    //$header.insertAdjacentElement("beforeend",Loader());
    //console.log(d.querySelector(".loader"));
    $aside.appendChild(MenuPanel());
    

    const thingy=ConectionButton(".conectar");
    //Alarm_Btn(thingy,"/Iot_Thingy52/app/assets/pcm0808m.wav");

    $thingyHeader.appendChild(Battery(thingy));

    //$main.appendChild(LoginIn());
    //$main.appendChild(LoginIn());

    //$asideAlarm.appendChild(AlarmScreen());
    console.log(thingy);
    $sensores.appendChild(Temperature(thingy,".btn-temperature"));
    $sensores.appendChild(Humidity(thingy,".btn-humidity"));
    $sensores.appendChild(GasSensor(thingy,".btn-gas"));

    $main.appendChild(LoginIn());
    $main.appendChild($sensores);
    $main.appendChild($dataBase);
    /*$main.appendChild(AlarmScreen());
    $main.appendChild(Temperature(thingy,".btn-temperature"));
    $main.appendChild(Humidity(thingy,".btn-humidity"));
    $main.appendChild(GasSensor(thingy,".btn-gas"));*/
    //Btn_Alarma(thdingy,".btn-alarm1","/Iot_Thingy52/app/assets/pcm0808m.wav");
    AlarmButton(thingy,".btn-alarm1","/app/assets/alarma.wav");

    //funciones helpers
    menuFunction(".panel-btn",".panelMenu");
    //ledController(thingy);

    $header.appendChild($thingyHeader);
    $header.appendChild($profileHeader);
    /*audioState=true;
    console.log(`audioState: ${audioState}`);*/
    /*let content = $main.innerHTML;
    console.log(content);*/


    //funcion de rutas del navegador
    router();

    //window.addEventListener("popstate", router);

    document.body.addEventListener("click", e => {
      if (e.target.matches("[data-link]")) {
          e.preventDefault();
          navigateTo(e.target.href);
      }
    });
  }