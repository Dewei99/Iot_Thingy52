export function PantallaAlarma(){
    const d=document,$panel = d.createElement("div"), $text = d.createElement("h2"),
    $boton=d.createElement("button");
    $boton.classList.add("btn-alarma2");
    $boton.innerHTML=`Desactivar`;
    $text.innerHTML=`Se ha activado la alarma`;
    $panel.classList.add("alarm");
    $panel.appendChild($text);
    $panel.appendChild($boton);

    return $panel;
}