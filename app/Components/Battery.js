export function Battery() {
    const $battery = document.createElement("div");
    $battery.classList.add("battery");

    $battery.innerHTML=`<h2> Bateria </h2>`;

    return $battery;
}