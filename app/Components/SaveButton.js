export function SaveButton(name){

    const d=document, $div = d.createElement("div"),$button=d.createElement("button"),
    $message=d.createElement("div");
    $div.classList.add("savePanel");
    $button.classList.add(name);
    $button.innerHTML="Save";
    $message.classList.add("message");
    $div.appendChild($button);
    $div.appendChild($message);
    //$title.after(Loader());
    return $div;
}