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

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
    $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu"),$asideAlarm=d.querySelector(".panelAlarm"), 
    $sensores = d.createElement("div"),$thingyHeader = d.createElement("div"),$dataBase = d.createElement("div");;
    //const $profileHeader= d.createElement("div"),


    $sensores.classList.add("sensores");
    $dataBase.classList.add("dataBase");
    $thingyHeader.classList.add("thingyHeader");
    //$profileHeader.classList.add("profileHeader");
    //$dataBase.innerHTML=`base de dato`;
     //let audioState=false;//esta variable se va a utilizar para activar o desactivar el envio de datos de audio al dispositivo
   // $root.appendChild(Title());

    $thingyHeader.appendChild(MenuButton());
    $thingyHeader.appendChild(Logo());
    $thingyHeader.appendChild(Title());
    $thingyHeader.appendChild(Loader());

    $header.appendChild($thingyHeader);
    //$profileHeader.appendChild(ProfilePicture());

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

    //$thingyHeader.appendChild(Battery(thingy));
    $thingyHeader.insertAdjacentElement("beforeend", Battery(thingy));
    $header.appendChild(ProfileHeader());
    //$main.appendChild(LoginIn());
    //$main.appendChild(LoginIn());

    $asideAlarm.appendChild(AlarmScreen());
    console.log(thingy);
    $sensores.appendChild(Temperature(thingy,".btn-temperature"));
    $sensores.appendChild(Humidity(thingy,".btn-humidity"));
    $sensores.appendChild(GasSensor(thingy,".btn-gas"));
    //$sensores.appendChild(Microphone(thingy,".btn-microphone"));


    $main.appendChild(LogIn());
    $main.appendChild($sensores);
    $main.appendChild($dataBase);
    $main.appendChild(DeleteMessage());
    /*$main.appendChild(AlarmScreen());
    $main.appendChild(Temperature(thingy,".btn-temperature"));
    $main.appendChild(Humidity(thingy,".btn-humidity"));
    $main.appendChild(GasSensor(thingy,".btn-gas"));*/
    //Btn_Alarma(thdingy,".btn-alarm1","/Iot_Thingy52/app/assets/pcm0808m.wav");
    AlarmButton(thingy,".btn-alarm1","/app/assets/alarma.wav");

    //funciones helpers
    menuFunction(".panel-btn",".panelMenu");
    //ledController(thingy);

    /*audioState=true;
    console.log(`audioState: ${audioState}`);*/
    /*let content = $main.innerHTML;
    console.log(content);*/


    //funcion de rutas del navegador
    router();

    //renderizar datos de la base de datos
    RenderData();

    //da funcionalidad a los botones delete
    deleteData();
    //userData();
    //window.addEventListener("popstate", router);

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
        e.preventDefault;
        getAjax("/user",
        function(data){
            console.log(data);
        }
        );
    });
  }