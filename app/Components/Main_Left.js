import { Menu } from "./Menu.js";

export function MainLeft() {
    const $left = document.createElement("div");
    $left.classList.add("mainLeft");
    $left.appendChild(Menu());
    return $left;
}