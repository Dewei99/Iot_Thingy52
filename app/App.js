//import { Menu } from "./Components/Menu.js";
import { MainLeft } from "./Components/Main_Left.js";
import { MainRight } from "./Components/Main_Right.js";
import { Title } from "./Components/Title.js";
import { Header } from "./Components/Header.js";

export function App(){
    const d=document, $root = d.getElementById("root");

   // $root.appendChild(Title());
    $root.appendChild(Header());
    $root.appendChild(MainLeft());
    $root.appendChild(MainRight())
}