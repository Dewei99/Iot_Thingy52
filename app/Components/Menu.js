
export function Menu() {
    const $menu = document.createElement("div");
    $menu.innerHTML =`            
    <button class="panel-btn hamburger hamburger--vortex" type="button">
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
    `;
    return $menu;
}