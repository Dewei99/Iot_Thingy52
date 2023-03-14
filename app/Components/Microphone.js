import { date } from "../helpers/date.js";
import { ledController } from "../helpers/ledController.js";
import { postAjax } from "../helpers/postAjax.js";
import { time } from "../helpers/time.js";
import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { SaveButton } from "./SaveButton.js";

export function Microphone(thingy, boton){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $microphone = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,data_x=[],data_y=[];
    let $chart, high=true,low=true,normal=true;

    $article.classList.add("microphone");                            
    $microphone.id="chart-microphone";

    $title.classList.add("title"); 

    $article.appendChild($title);
    $article.appendChild($microphone);
    $article.appendChild(SaveButton("save-microphone"));
    localStorage.setItem('noiseWarning', 'off');
    
    function logData(data) {
        console.log(data.detail);
       /* $title.innerHTML = `
        <header>Nivel de ruido</header>
        Ruido (dB): ${data.detail.value} ${data.detail.unit}`;*/
        //actualizar gráfica
        /*updateData($chart, data.detail.value);
        data_y.push(data.detail.value);
        data_x.push(time());
        if(data.detail.value>=38){
            $title.innerHTML = `
            <header>Temperatura</header>
            Temperature: ${data.detail.value} ${data.detail.unit} (Warning: Calor)`;
            localStorage.setItem('temperatureWarning', 'on');
            $article.classList.add("warning");
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
        }else if (data.detail.value<=10){
            $title.innerHTML = `
            <header>Temperatura</header>
            Temperature: ${data.detail.value} ${data.detail.unit} (Warning: Frío)`;
            localStorage.setItem('temperatureWarning', 'on');
            $article.classList.add("warning");
            if(low===true){
                ledController(thingy);
                low=false;
                normal=true;
            }
        }else{
            localStorage.setItem('temperatureWarning', 'off');
            $article.classList.remove("warning");
            if(normal===true){
                ledController(thingy);
                high=true;
                low=true;
                normal=false;
            }
        }*/
    }


    async function start_Microphone(device) {
        try{
            let bool=await device.microphone.start();
            let servicio=await device.addEventListener("microphone", logData);
            $boton.classList.add("is-active");
            console.log("estoy en la función start");
            console.log(bool);
            console.log(`solicitud de servicio: ${servicio}`);
            $article.classList.add("is-active");
            estado=1;
            console.log(`encender temperatura, estado:${estado}, display ${$article.style.display}`);
        
        } catch(error){
            console.error(error);
            console.log("no conectado");
            $title.innerHTML=`No está conectado al Thingy:52`;
        }
    }

    async function stop_Microphone(device) {
        //await thingy.connect();
        try{
            let bool=await device.microphone.stop();
            $article.classList.remove("is-active");
            console.log("estoy en la función stop");
            console.log(bool);
            $boton.classList.remove("is-active");
            $title.innerHTML=`Parado la lectura del sensor`;
            estado=0;
            console.log(`apagar temperatura, estado:${estado}`);
        } catch(error){
            console.error(error);
            $title.innerHTML=`Error en la desconexion`;
        }
    }

    d.addEventListener("click", async function(e){
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                $chart=CreateChart("chart-microphone","microphone (dB)");
                console.log($chart);

                console.log(`existe chart: ${$chart}`);
                $article.classList.toggle("is-active");
                start_Microphone(thingy);

                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Microphone(thingy);

            }else{
                console.log("error");
            }          
        }   

        if(e.target.getAttribute("class")=="save-microphone"){
            let objeto={
                sensor: "Microphone (dB)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            console.log(date());
            postAjax("/save", JSON.stringify(objeto), 
                function(data){
                    const d=document,$panel=d.querySelector(".save-microphone"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
            },  function(error){
                    const d=document,$panel=d.querySelector(".save-microphone"),
                    $newMessage=$panel.parentElement.querySelector(".message");
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(error.status);
                    $newMessage.innerHTML=`<b>Error ${error.status}: ${errorMessage}</b>`;
                    $newMessage.classList.add("error"); 
                    setTimeout(function(){
                        $newMessage.classList.remove("error"); 
                    },3000);
                    
            }
            )
        }
        e.stopPropagation();
    });
    
    return $article;
}