export function MenuPanel(){
    const $panelMenu = document.createElement("div");
    $panelMenu.classList.add("menu");
    $panelMenu.innerHTML=`
        <button type="button" class="conectar">Conectar</button>
        <button type="button" class="btn-temperature">Temperatura</button>
        <button type="button" class="btn-humidity">Humedad</button>
        <button type="button" class="btn-gas">Gas</button>


        <button type="button" class="btn-alarm1">Alarma</button>
    `;
    //        <button type="button" class="btn-microphone">Ruido</button>

    return $panelMenu;
}