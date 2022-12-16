export function Temperatura(thingy, boton){
    const d=document,$article=d.createElement("article"),$temperatura = d.createElement("div"),$boton=d.querySelector(boton);
    let estado=0;

    //$temperatura.classList.add("temperatura");
    $article.classList.add("temperatura");
    $temperatura.classList.add("chart-temperatura");

    $article.appendChild($temperatura);

    async function start_Temperatura(device) {
        //await thingy.connect();
        try{
            let bool=await device.temperature.start();
            let servicio=await device.addEventListener("temperature", logData);
            $boton.classList.add("is-active");
            console.log("estoy en la función start");
            console.log(bool);
            console.log(`solicitud de servicio: ${servicio}`);
            //$temperatura.classList.add("is-active");
            $article.classList.add("is-active");
            estado=1;
            console.log(`encender temperatura, estado:${estado}, display ${$temperatura.style.display}`);
        
        } catch(error){
            //$article.classList.add("is-active");
            console.error(error);
            console.log("no conectado");
            $temperatura.innerHTML=`No está conectado al Thingy:52`;
            //estado=1;
        }
    }

    async function stop_Temperatura(device) {
        //await thingy.connect();
        try{
            let bool=await device.temperature.stop();
            //$temperatura.classList.remove("is-active");
            $article.classList.remove("is-active");
            console.log("estoy en la función stop");
            console.log(bool);
            $boton.classList.remove("is-active");
            $temperatura.innerHTML=`Parado la lectura del sensor`;
            estado=0;
            console.log(`apagar temperatura, estado:${estado}`);
        } catch(error){
            //$article.classList.add("is-active");
            console.error(error);
            $temperatura.innerHTML=`Error en la desconexion`;
            //estado=0;
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
            //$temperatura.classList.toggle("is-active");
            if(estado===0){
                //estado=1;
                //estado=0;
                
                //$temperatura.style.display="block";
                $article.classList.toggle("is-active");
                start_Temperatura(thingy);
                //console.log(`encender temperatura, estado:${estado}, display ${$temperatura.style.display}`);
                //$article.classList.toogle("is-active");
                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Temperatura(thingy);
                //$article.classList.remove("is-active");
                //$article.classList.toogle("is-active");
                //estado=1;
                //estado=0;
                //console.log(`apagar temperatura, estado:${estado}`);
                //$temperatura.innerHTML = "";
                //$temperatura.style.display="none";
                
            }else{
                console.log("error");
            }
            
        }
    
    });
    
    
    /*$temperatura.innerHTML=`
        <header>Temperatura</header>
    `;*/


    return $article;
}