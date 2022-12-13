export function Temperatura(thingy, boton){
    const d=document,$temperatura = d.createElement("article");

    $temperatura.classList.add("temperatura");

    async function start_Temperatura(device) {
        //await thingy.connect();
        await device.temperature.start();
        await device.addEventListener("temperature", logData);
    }

    function logData(data) {
        //const el = document.querySelector("#temperature");
        $temperatura.innerHTML = `
        <header>Temperatura</header>
        Temperature: ${data.detail.value} ${data.detail.unit}`;
    }

    d.addEventListener("click", e=>{
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){
            start_Temperatura(thingy);
        }
    
    });
    
    
    $temperatura.innerHTML=`
        <header>Temperatura</header>
    `;


    return $temperatura;
}