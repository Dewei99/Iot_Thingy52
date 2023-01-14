import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { ledController } from "../helpers/ledController.js";
export function Humidity(thingy, boton){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $humedad = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0;
    let $chart,high=true,normal=true;

    $article.classList.add("humedad");                            
    $humedad.id="chart-humedad";

    $article.appendChild($title);
    $article.appendChild($humedad);
    
    localStorage.setItem('humidityWarning', 'off');

    function logData(data) {

        $title.innerHTML = `
        <header>Humedad</header>
        Humedad: ${data.detail.value} ${data.detail.unit}`;
        updateData($chart, data.detail.value);
        //console.log(data);
        if(data.detail.value>=65){
            $title.innerHTML = `
            <header>Humedad</header>
            Humedad: ${data.detail.value} ${data.detail.unit} (Alto)`;
            updateData($chart, data.detail.value);
            localStorage.setItem('humidityWarning', 'on');
            $article.classList.add("warning");
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
        }else{
            localStorage.setItem('humidityWarning', 'off');
            $article.classList.remove("warning");
            if(normal===true){
                ledController(thingy);
                high=true;
                normal=false;
            }
        }
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