import { motionSensors } from "../helpers/motionSensors.js";

export function Btn_Alarma(thingy, boton, wavFile){
    /*const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $temperatura = d.createElement("canvas"),$boton=d.querySelector(boton);*/
    const d=document,$boton=d.querySelector(boton), $screen=d.querySelector("alarm");
    let estado=0;
    let $chart;
    
   /* function logData(data) {

        $title.innerHTML = `
        <header>Temperatura</header>
        Temperature: ${data.detail.value} ${data.detail.unit}`;
        updateData($chart, data.detail.value);
    }*/


    async function start_Alarm(device) {
        try{
            //activar sensores de movimiento
            motionSensors(device, wavFile);
            $boton.classList.add("is-active");
            //motionSensors(device);
            /*console.log("estoy en la función start");
            console.log(bool);
            console.log(`solicitud de servicio: ${servicio}`);*/
            //$article.classList.add("is-active");
            estado=1;
           // console.log(`encender temperatura, estado:${estado}, display ${$article.style.display}`);
        
        } catch(error){
            console.error(error);
            console.log("no conectado");
           // $title.innerHTML=`No está conectado al Thingy:52`;
        }
    }

    async function stop_Alarm(device) {
        //await thingy.connect();
        try{
            let bool=await device.rawdata.stop();
            //await device.rawdata.start();
            /*$article.classList.remove("is-active");
            console.log("estoy en la función stop");
            console.log(bool);*/
            $boton.classList.remove("is-active");
            //$title.innerHTML=`Parado la lectura del sensor`;
            estado=0;
           // console.log(`apagar temperatura, estado:${estado}`);
        } catch(error){
            console.error(error);
           // $title.innerHTML=`Error en la desconexion`;
        }
    }

    d.addEventListener("click", async function(e){
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                //$chart=CreateChart("chart-temperatura","Temperatura (ºC)");
                //console.log($chart);

                //console.log(`existe chart: ${$chart}`);
                //$article.classList.toggle("is-active");
                //$boton.classList.add("is-active");
                start_Alarm(thingy);

                
            }else if(estado===1){
                //$article.classList.toggle("is-active");
                stop_Alarm(thingy);

            }else{
                console.log("error");
            }          
        }   
    });
    
    //return $article;
}