export function DeleteMessage (){
    const $message=document.createElement("div");
    $message.classList.add("deleteMessage");
    $message.innerHTML="Eliminado correctamente";

    return $message;
}