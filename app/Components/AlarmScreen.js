//función encargado de renderizar la ventana de alarma
export function AlarmScreen(){
    const d=document,$panel = d.createElement("div"), $text = d.createElement("h2"),
    $boton=d.createElement("button"),$panelAlarm=d.querySelector(".panelAlarm");
    $boton.classList.add("btn-alarma2");
    //Lo que pone en el botón
    $boton.innerHTML=`Desactivar`;

    //texto que se mostrará
    $text.innerHTML=`Se ha activado la alarma`;
    $panel.classList.add("alarm");
    $panel.appendChild($text);
    $panel.appendChild($boton);

    //espera de evento de pulsar el botón desactivar
    d.addEventListener("click", async function(e){
        if(e.target.matches(".btn-alarma2")||e.target.matches(`${".btn-alarma2"} *`)){
            //cerrar ventana
            $panelAlarm.classList.remove("is-active");
            $panel.classList.remove("is-active");
            
            //apagar alarma
            localStorage.setItem('alarm', 'off');
        }   
    });


    return $panel;
}