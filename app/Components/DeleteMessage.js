//Renderizar mensaje que se muestra en la aplicación cuando se borra dados de la base de datos
export function DeleteMessage (){
    const $message=document.createElement("div");
    $message.classList.add("deleteMessage");
    //mensaje que se muestra
    $message.innerHTML="Eliminado correctamente";

    return $message;
}