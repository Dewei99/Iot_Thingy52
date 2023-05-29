//se encarga de renderizar el menú y los botones de sensores
export function MenuPanel(){
    const $panelMenu = document.createElement("div");
    $panelMenu.classList.add("menu");

    //Definir botones
    $panelMenu.innerHTML=`
        <button type="button" class="conectar">Conectar</button>
        <button type="button" class="btn-temperature">Temperatura</button>
        <button type="button" class="btn-humidity">Humedad</button>
        <button type="button" class="btn-gas">Gas</button>

        <button type="button" class="btn-alarm1">Alarma</button>
    `;

    return $panelMenu;
}