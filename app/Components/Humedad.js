export function Humedad(){
    const $humedad = document.createElement("article");
    $humedad.classList.add("humedad");
    $humedad.innerHTML=`
        <header>Humedad</header>
    `;


    return $humedad;
}