//función que renderiza un icono de carga
export function Loader(){
    const $loader = document.createElement("img")
    $loader.classList.add("loader");
    //ruta de la imagen
    $loader.src="/assets/loader.svg";
    $loader.alt = "Cargando...";
    return $loader;
}