export function RealTimeDataButton(name){

    const d=document, $div = d.createElement("div"),$button=d.createElement("button"),
    $message=d.createElement("div");
    $div.classList.add("realTimeDataPanel");
    $button.classList.add(name);
    $button.innerHTML="Share Data";
    $message.classList.add("message");
    $div.appendChild($button);
    $div.appendChild($message);
    //$title.after(Loader());
    return $div;
}