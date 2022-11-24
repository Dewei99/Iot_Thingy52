
export function Menu() {
    const $menu = document.createElement("div");
    $menu.classList.add("menu");
    $menu.innerHTML =`            
    <h1> THINGY:52</h1>
    <ul>
        <a href="enlaceMenu"> 1 </a>
        <a href="enlaceMenu"> 2 </a>
        <a href="enlaceMenu"> 3 </a>
        <a href="enlaceMenu"> 4 </a>
        <a href="enlaceMenu"> 5 </a>
    </ul>
    `;
    return $menu;
}