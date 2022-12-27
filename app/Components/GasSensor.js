import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./Chart.js";

export function GasSensor(thingy, boton){
    const d=document,$article=d.createElement("article"),$titleCO2 = d.createElement("div"),
    $titleCOV = d.createElement("div"),$CO2 = d.createElement("canvas"),$COV = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0;
    let $chartCO2, $chartCOV;

    $article.classList.add("gas");

    $CO2.id="chart-CO2";

    $COV.id="chart-COV";

    $article.appendChild($titleCO2);
    $article.appendChild($CO2);
    $article.appendChild($titleCOV);
    $article.appendChild($COV);

    //funcion para actualizar los datos de las gráficas
    function logData(data) {
        console.log(data);
        $titleCO2.innerHTML = `
        <header>CO2</header>
        CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit}`;

        $titleCOV.innerHTML = `
        <header>COV</header>
        COV: ${data.detail.TVOC.value} ${data.detail.TVOC.unit}`;

        updateData($chartCO2, data.detail.eCO2.value);
        updateData($chartCOV, data.detail.TVOC.value);
    }


    async function start_Gas(device) {
        try{
            let bool=await device.gas.start();
            let servicio=await device.addEventListener("gas", logData);
            $boton.classList.add("is-active");
            console.log("estoy en la función start");
            console.log(bool);
            console.log(`solicitud de servicio: ${servicio}`);
            $article.classList.add("is-active");
            estado=1;
            console.log(`encender sensor gas, estado:${estado}, display ${$article.style.display}`);
        
        } catch(error){
            console.error(error);
            console.log("no conectado");
            $titleCO2.innerHTML=`No está conectado al Thingy:52`;
        }
    }

    async function stop_Gas(device) {

        try{
            let bool=await device.gas.stop();
            $article.classList.remove("is-active");
            console.log("estoy en la función stop");
            console.log(bool);
            $boton.classList.remove("is-active");
            $titleCO2.innerHTML=`Parado la lectura del sensor`;
            estado=0;
            console.log(`apagar Gas, estado:${estado}`);
        } catch(error){
            console.error(error);
            $titleCO2.innerHTML=`Error en la desconexion`;
        }
    }

    d.addEventListener("click", async function(e){
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                console.log("hola");

                //crear gráficas
                $chartCO2=CreateChart("chart-CO2","C02 (ppm)");
                $chartCOV=CreateChart("chart-COV","COV (ppb)");
                
                console.log($chartCO2);
                console.log($chartCOV);

                console.log(`existe chart: ${$chartCO2}`);
                $article.classList.toggle("is-active");
                start_Gas(thingy);

                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Gas(thingy);

            }else{
                console.log("error");
            }          
        }   
    });
    
    return $article;
}