//función encargado de renderizar el estado de conexión de la aplicación con el dispositivo thingy 52 
export function Title (){
    const $title = document.createElement("h2")
    $title.classList.add("title");
    $title.innerHTML = "Thingy:52 - Desconectado";
    return $title;
}