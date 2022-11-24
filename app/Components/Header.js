
export function Header() {
    const $header = document.createElement("header");
    $header.classList.add("header");

    $header.innerHTML=`<h1> Bateria </h1>`;

    return $header;
}