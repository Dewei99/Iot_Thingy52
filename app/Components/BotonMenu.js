
export function BotonMenu() {
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