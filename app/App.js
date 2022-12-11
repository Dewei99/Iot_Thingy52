import { Menu } from "./Components/Menu.js";
import { MainLeft } from "./Components/Main_Left.js";
import { MainRight } from "./Components/Main_Right.js";
import { Title } from "./Components/Title.js";
import { Header } from "./Components/Header.js";
import { Logo } from "./Components/Logo.js";


export function App(){
    const d=document, $main = d.querySelector(".main"), $header = d.querySelector(".header"), $footer=d.querySelector(".footer");

   // $root.appendChild(Title());
    $header.appendChild(Menu());
    $header.appendChild(Logo());
    $header.appendChild(Title());
    //$main.appendChild(MainLeft());


}