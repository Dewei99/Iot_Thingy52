//función que renderiza el logo
export function Logo(){
    const $logo = document.createElement("img");
    //ruta de la imagen
    $logo.src="/assets/logotipo.png";
    $logo.alt="logotipo";
    return $logo;
}