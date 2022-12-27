export function PanelMenu(){
    const $panelMenu = document.createElement("div");
    $panelMenu.classList.add("menu");
    $panelMenu.innerHTML=`
        <button type="button" class="conectar">Conectar</button>
        <button type="button" class="btn-temperatura">Temperatura</button>
        <button type="button" class="btn-humedad">Humedad</button>
        <button type="button" class="btn-gas">Gas</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
    `;


    return $panelMenu;
}