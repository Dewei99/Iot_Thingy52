import { BotonMenu } from "./Components/BotonMenu.js";
import { Title } from "./Components/Title.js";
import { Logo } from "./Components/Logo.js";
import {funcionMenu} from "./helpers/funcionMenu.js";
import { PanelMenu } from "./Components/PanelMenu.js";
import { Battery } from "./Components/Battery.js";
import { Temperatura } from "./Components/Temperature.js";
import { Humedad } from "./Components/Humididy.js";
import { Btn_Conexion } from "./Components/Boton_Conexion.js";
import { Loader } from "./Components/Loader.js";
import {GasSensor} from "./Components/GasSensor.js";

export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
     $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu");

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
    
    $header.appendChild(Battery(thingy));


    console.log(thingy);

    $main.appendChild(Temperatura(thingy,".btn-temperatura"));
    $main.appendChild(Humedad(thingy,".btn-humedad"));
    $main.appendChild(GasSensor(thingy,".btn-gas"));

    //funciones helpers
    funcionMenu(".panel-btn",".panelMenu");
}