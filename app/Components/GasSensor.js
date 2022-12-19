import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./Chart.js";

export function Humedad(thingy, boton){
    const d=document,$article=d.createElement("article"),$titleCO2 = d.createElement("div"),
    $titleCOV = d.createElement("div"),$CO2 = d.createElement("canvas"),$COV = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0;
    let $chart;

    $article.classList.add("gas");

    $CO2.id="chart-CO2";

    $CO2.id="chart-COV";

    $article.appendChild($titleCO2);
    $article.appendChild($CO2);
    $article.appendChild($titleCO2);
    $article.appendChild($COV);
    function logData(data) {

        $titleCO2.innerHTML = `
        <header>CO2</header>
        CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit}`;

        $titleCOV.innerHTML = `
        <header>COV</header>
        COV: ${data.detail.TVOC.value} ${data.detail.TVOC.unit}`;

        updateData($chart, data.detail.value);
    }


    async function start_Humedad(device) {
        try{
            let bool=await device.humidity.start();
            let servicio=await device.addEventListener("humidity", logData);
            $boton.classList.add("is-active");
            console.log("estoy en la función start");
            console.log(bool);
            console.log(`solicitud de servicio: ${servicio}`);
            $article.classList.add("is-active");
            estado=1;
            console.log(`encender humedad, estado:${estado}, display ${$humedad.style.display}`);
        
        } catch(error){
            console.error(error);
            console.log("no conectado");
            $title.innerHTML=`No está conectado al Thingy:52`;
        }
    }

    async function stop_Humedad(device) {
        //await thingy.connect();
        try{
            let bool=await device.humidity.stop();
            $article.classList.remove("is-active");
            console.log("estoy en la función stop");
            console.log(bool);
            $boton.classList.remove("is-active");
            $title.innerHTML=`Parado la lectura del sensor`;
            estado=0;
            console.log(`apagar Humedad, estado:${estado}`);
        } catch(error){
            console.error(error);
            $title.innerHTML=`Error en la desconexion`;
        }
    }

    d.addEventListener("click", async function(e){
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                $chart=CreateChart("chart-humedad","Humedad (%)");
                console.log($chart);

                console.log(`existe chart: ${$chart}`);
                $article.classList.toggle("is-active");
                start_Humedad(thingy);

                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Humedad(thingy);

            }else{
                console.log("error");
            }          
        }   
    });
    
    return $article;
}