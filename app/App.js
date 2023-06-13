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
import { router } from "./helpers/router.js";
import { navigateTo } from "./helpers/navigateTo.js";
import { LogIn } from "./Components/LogIn.js";
import { ProfileHeader } from "./Components/ProfileHeader.js";
import { getAjax } from "./helpers/getAjax.js";
import { RenderData } from "./Components/RenderData.js";
import { deleteData } from "./helpers/deleteData.js";
import { DeleteMessage } from "./Components/DeleteMessage.js";
import { RenderRealTimeData } from "./Components/RenderRealTimeData.js";

//aquí se renderiza todos los componentes de la aplicación y también se llaman las funciones helpers
export function App(){
    const d=document, 
    //seleccionar elementos de html através de la api de DOM
    $main = d.querySelector(".main"), $header = d.querySelector(".header"),
    $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu"),$asideAlarm=d.querySelector(".panelAlarm"), 
    $sensores = d.createElement("div"),$thingyHeader = d.createElement("div"),$dataBase = d.createElement("div"),$realTimeData = d.createElement("div");
    //definir valores límites para la activación de alerta
    let limiteTemperatura={max:32,min:5},limiteHumedad=65,limiteCO2=1000,limiteCOV=600;
    //guardar variables en el almacenamiento local del navegador
    localStorage.setItem('shareTemperature', 'off');
    localStorage.setItem('shareHumidity', 'off');
    localStorage.setItem('shareGas', 'off');
    //añadir clases
    $sensores.classList.add("sensores");
    $dataBase.classList.add("dataBase");
    $realTimeData.classList.add("realTimeData");
    //se renderiza los componentes de la cabecera
    $thingyHeader.classList.add("thingyHeader");

    //se renderiza los componentes de la cabecera
    $thingyHeader.appendChild(MenuButton());
    $thingyHeader.appendChild(Logo());
    $thingyHeader.appendChild(Title());
    $thingyHeader.appendChild(Loader());
    $header.appendChild($thingyHeader);

    //renderizar componente del menú
    $aside.appendChild(MenuPanel());
    //renderizar la ventana de inicio de sesión
    $main.appendChild(LogIn());
    
    //funcionamiento del botón conectar
    const thingy=ConectionButton(".conectar");

    //renderizar otro componente de la cabecera
    $thingyHeader.insertAdjacentElement("beforeend", Battery(thingy));
    $header.appendChild(ProfileHeader());

    //renderizar la ventana de aviso de activación de alarma
    $asideAlarm.appendChild(AlarmScreen());
    console.log(thingy);
    //renderizar los componentes que pertenece a la vista de sensores
    $sensores.appendChild(Temperature(thingy,".btn-temperature",limiteTemperatura));
    $sensores.appendChild(Humidity(thingy,".btn-humidity",limiteHumedad));
    $sensores.appendChild(GasSensor(thingy,".btn-gas",limiteCO2,limiteCOV));

    //renderizarlos en el elemento main de html
    $main.appendChild($sensores);
    $main.appendChild($dataBase);
    $main.appendChild( $realTimeData);
    //mensaje de eliminación de datos
    $main.appendChild(DeleteMessage());

    //botón de activación de alarma
    AlarmButton(thingy,".btn-alarm1","/assets/alarma.wav");

    //funciones helpers
    menuFunction(".panel-btn",".panelMenu");

    //funcion de rutas del navegador
    router();

    //renderizar datos de la base de datos
    RenderData();

    //renderizar datos del modo remoto, muestran los datos en tiempo real de la base de datos
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
    //mostrar mensaje de error de inicio de sesión
    if(error=='on'){
        $error.classList.add("is-active");
        
    }else if(error=='off'){
        $error.classList.remove("is-active");
    }

    //en el inicio de sesión, se envía al lado de servidor el nombre de usuario y la contraseña 
    $form.addEventListener("submit", (e)=>{
        localStorage.setItem('error', 'off');
        //e.preventDefault;
        getAjax("/user",
        function(data){
            console.log(data);
        },function(error){
            console.log(error);
            localStorage.setItem('error', 'on');
        }
        );
    });
  }