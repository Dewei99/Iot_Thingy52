export function AlarmScreen(){
    const d=document,$panel = d.createElement("div"), $text = d.createElement("h2"),
    $boton=d.createElement("button"),$panelAlarm=d.querySelector(".panelAlarm");
    $boton.classList.add("btn-alarma2");
    $boton.innerHTML=`Desactivar`;
    $text.innerHTML=`Se ha activado la alarma`;
    $panel.classList.add("alarm");
    $panel.appendChild($text);
    $panel.appendChild($boton);

    d.addEventListener("click", async function(e){
        if(e.target.matches(".btn-alarma2")||e.target.matches(`${".btn-alarma2"} *`)){
            $panelAlarm.classList.remove("is-active");
            $panel.classList.remove("is-active");
            localStorage.setItem('alarm', 'off');
        }   
    });


    return $panel;
}