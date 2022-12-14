export function Humedad(){
    const $humedad = document.createElement("article");
    $humedad.classList.add("humedad");
    $humedad.innerHTML=`
        <header>Humedad</header>
    `;
    $humedad.style.display="none";
    $humedad.style.display="block";
    return $humedad;
}