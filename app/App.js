import { BotonMenu } from "./Components/BotonMenu.js";
import { Title } from "./Components/Title.js";
import { Logo } from "./Components/Logo.js";
import {funcionMenu} from "./helpers/funcionMenu.js";
import { PanelMenu } from "./Components/PanelMenu.js";
import { Battery } from "./Components/Battery.js";
import { Temperatura } from "./Components/Temperatura.js";
import { Humedad } from "./Components/Humedad.js";
import { conexion } from "./helpers/conexion.js";


export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"),
     $footer=d.querySelector(".footer"),$aside=d.querySelector(".panelMenu");

   // $root.appendChild(Title());
    $header.appendChild(BotonMenu());
    $header.appendChild(Logo());
    $header.appendChild(Title());
    $header.appendChild(Battery());


    $aside.appendChild(PanelMenu())

    //funciones
    funcionMenu(".panel-btn",".panelMenu");
    const thingy=conexion("#conectar");
  
    $main.appendChild(Temperatura(thingy,"#btn-temperatura"));
    $main.appendChild(Humedad());


    
}