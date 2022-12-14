export function Temperatura(thingy, boton){
    const d=document,$temperatura = d.createElement("article");
    let estado=1;

    $temperatura.classList.add("temperatura");

    async function start_Temperatura(device) {
        //await thingy.connect();
        try{
            await device.temperature.start();
            await device.addEventListener("temperature", logData);
        } catch(error){
            console.error(error);
        }
    }

    async function stop_Temperatura(device) {
        //await thingy.connect();
        try{
            await device.temperature.stop();
        } catch(error){
            console.error(error);
            $temperatura.innerHTML=`No está conectado al Thingy:52`;
        }
    }


    function logData(data) {
        //const el = document.querySelector("#temperature");
        $temperatura.innerHTML = `
        <header>Temperatura</header>
        Temperature: ${data.detail.value} ${data.detail.unit}`;
    }

    d.addEventListener("click", async function(e){
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){
            $temperatura.classList.toggle("is-active");
            if(estado===1){

                estado=0;
                console.log(`encender temperatura, estado:${estado}, display ${$temperatura.style.display}`);
                //$temperatura.style.display="block";
                start_Temperatura(thingy);
            }else if(estado===0){
                stop_Temperatura(thingy);
 
                estado=1;
                console.log(`apagar temperatura, estado:${estado}`);
                $temperatura.innerHTML = "";
                //$temperatura.style.display="none";
            }else{
                console.log("error");
            }
            
        }
    
    });
    
    
    /*$temperatura.innerHTML=`
        <header>Temperatura</header>
    `;*/


    return $temperatura;
}