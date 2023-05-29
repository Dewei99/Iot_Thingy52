//función que renderiza el botón utilizado para desplegar el menú
export function MenuButton() {
    const d=document, $menu = d.createElement("div");
    $menu.classList.add("panel-btn");
    $menu.innerHTML =`            
    <button class="panel-btn hamburger hamburger--vortex" type="button">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    `;
    return $menu;
}