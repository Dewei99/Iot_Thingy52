export function PanelMenu(){
    const $panelMenu = document.createElement("div");
    $panelMenu.classList.add("menu");
    $panelMenu.innerHTML=`
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
        <button type="button">Click Me!</button>
    `;


    return $panelMenu;
}