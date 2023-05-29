//función encargado de renderizar el botón de guardar datos
export function SaveButton(name){
    const d=document, $div = d.createElement("div"),$button=d.createElement("button"),
    $message=d.createElement("div");
    $div.classList.add("savePanel");
    $button.classList.add(name);
    $button.innerHTML="Guardar";
    $message.classList.add("message");
    $div.appendChild($button);
    $div.appendChild($message);
    return $div;
}