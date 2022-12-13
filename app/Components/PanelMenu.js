export function PanelMenu(){
    const $panelMenu = document.createElement("div");
    $panelMenu.classList.add("menu");
    $panelMenu.innerHTML=`
        <button type="button" id="conectar">Conectar</button>
        <button type="button" id="btn-temperatura">Temperatura</button>
        <button type="button" id="btn-humedad">Humedad</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
    `;


    return $panelMenu;
}