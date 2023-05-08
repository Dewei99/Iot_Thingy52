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
import { LogIn } from "./Components/LogIn.js";
import { ProfilePicture } from "./Components/ProfilePicture.js";
import { ProfileHeader } from "./Components/ProfileHeader.js";
import { userData } from "./helpers/userData.js";
import { getAjax } from "./helpers/getAjax.js";
import { RenderData } from "./Components/RenderData.js";
import { deleteData } from "./helpers/deleteData.js";
import { DeleteMessage } from "./Components/DeleteMessage.js";
import { Microphone } from "./Components/Microphone.js";
import { RenderRealTimeData } from "./Components/RenderRealTimeData.js";

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
    $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu"),$asideAlarm=d.querySelector(".panelAlarm"), 
    $sensores = d.createElement("div"),$thingyHeader = d.createElement("div"),$dataBase = d.createElement("div"),$realTimeData = d.createElement("div");
    //const $profileHeader= d.createElement("div"),
    localStorage.setItem('shareTemperature', 'off');
    localStorage.setItem('shareHumidity', 'off');
    localStorage.setItem('shareGas', 'off');

    $sensores.classList.add("sensores");
    $dataBase.classList.add("dataBase");
    $realTimeData.classList.add("realTimeData");
    $thingyHeader.classList.add("thingyHeader");

    $thingyHeader.appendChild(MenuButton());
    $thingyHeader.appendChild(Logo());
    $thingyHeader.appendChild(Title());
    $thingyHeader.appendChild(Loader());

    $header.appendChild($thingyHeader);

    $aside.appendChild(MenuPanel());
    $main.appendChild(LogIn());
    
    const thingy=ConectionButton(".conectar");

    $thingyHeader.insertAdjacentElement("beforeend", Battery(thingy));
    $header.appendChild(ProfileHeader());


    $asideAlarm.appendChild(AlarmScreen());
    console.log(thingy);
    $sensores.appendChild(Temperature(thingy,".btn-temperature"));
    $sensores.appendChild(Humidity(thingy,".btn-humidity"));
    $sensores.appendChild(GasSensor(thingy,".btn-gas"));
    //$sensores.appendChild(Microphone(thingy,".btn-microphone"));



    $main.appendChild($sensores);
    $main.appendChild($dataBase);
    $main.appendChild( $realTimeData);
    $main.appendChild(DeleteMessage());

    AlarmButton(thingy,".btn-alarm1","/assets/alarma.wav");

    //funciones helpers
    menuFunction(".panel-btn",".panelMenu");

    //funcion de rutas del navegador
    router();

    //renderizar datos de la base de datos
    RenderData();

    //renderizar datos en tiempo real de la base de datos
    RenderRealTimeData();
    //da funcionalidad a los botones delete
    deleteData();

    document.body.addEventListener("click", e => {
      if (e.target.matches("[data-link]")) {
          e.preventDefault();
          //e.stopImmediatePropagation();
          navigateTo(e.target.href);
      }
    });

    //comprobar inicio de sesión
    const $error=d.querySelector(".error"),$form=d.querySelector(".login");
    let error=localStorage.getItem('error');
    console.log(error);
    if(error=='on'){
        $error.classList.add("is-active");
        
    }else if(error=='off'){
        $error.classList.remove("is-active");
    }

    $form.addEventListener("submit", (e)=>{
        localStorage.setItem('error', 'off');
        //e.preventDefault;
        getAjax("/user",
        function(data){
            console.log(data);
        }
        );
    });
  }