import { Loader } from "./Loader.js";

export function Title (){

    const $title = document.createElement("h2")
    $title.classList.add("title");
    $title.innerHTML = "Thingy:52 - Desconectado";
    //$title.after(Loader());
    return $title;
}