import { date } from "../helpers/date.js";
import { ledController } from "../helpers/ledController.js";
import { postAjax } from "../helpers/postAjax.js";
import { time } from "../helpers/time.js";
import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { SaveButton } from "./SaveButton.js";

export function Temperature(thingy, boton){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $temperatura = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,data_x=[],data_y=[];
    let $chart, high=true,low=true,normal=true,ifttt=true;

    $article.classList.add("temperatura");                            
    $temperatura.id="chart-temperatura";

    $title.classList.add("title"); 

    $article.appendChild($title);
    $article.appendChild($temperatura);
    $article.appendChild(SaveButton("save-temperature"));
    localStorage.setItem('temperatureWarning', 'off');
    
    function logData(data) {

        $title.innerHTML = `
        <header>Temperatura</header>
        Temperature: ${data.detail.value} ${data.detail.unit}`;
        //actualizar gráfica
        updateData($chart, data.detail.value);
        data_y.push(data.detail.value);
        data_x.push(time());
        if(data.detail.value>=38){
            $title.innerHTML = `
            <header>Temperatura</header>
            Temperature: ${data.detail.value} ${data.detail.unit} (Warning: Calor)`;
            localStorage.setItem('temperatureWarning', 'on');
            $article.classList.add("warning");
            //evitar que se ejecute la funcion ledController constantemente
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
            //enviar un correo de alerta
            if(ifttt===true){
                ifttt=false;
                let objeto={event: "Temperatura",
                    alert:"elevada",
                    value:"más de 38º"    
                };
                postAjax("/ifttt",
                    JSON.stringify(objeto),
                    function(data){
                        console.log(data.message);
                    },  function(error){
                         console.log(error);
                    }
                );
                setTimeout(async function(){
                    ifttt=true;
                },60000);
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
            //enviar un correo de alerta
            if(ifttt===true){
                ifttt=false;
                let objeto={event: "Temperatura",
                    alert:"baja",
                    value:"menos de 10º"    
                };
                postAjax("/ifttt",
                    JSON.stringify(objeto),
                        function(data){
                        console.log(data.message);
                    },  function(error){
                      console.log(error);
                    }
                    );
                setTimeout(async function(){
                    ifttt=true;
                },60000);
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
        }
    }


    async function start_Temperatura(device) {
        try{
            let bool=await device.temperature.start();
            let servicio=await device.addEventListener("temperature", logData);
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

    async function stop_Temperatura(device) {
        //await thingy.connect();
        try{
            let bool=await device.temperature.stop();
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
                $chart=CreateChart("chart-temperatura","Temperatura (ºC)");
                console.log($chart);

                console.log(`existe chart: ${$chart}`);
                $article.classList.toggle("is-active");
                start_Temperatura(thingy);

                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Temperatura(thingy);
                localStorage.setItem('temperatureWarning', 'off');
                ledController(thingy);

            }else{
                console.log("error");
            }          
        }   

        if(e.target.getAttribute("class")=="save-temperature"){
            let objeto={
                sensor: "Temperature (ºC)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            console.log(date());
            postAjax("/save", JSON.stringify(objeto), 
                function(data){
                    const d=document,$panel=d.querySelector(".save-temperature"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
            },  function(error){
                    const d=document,$panel=d.querySelector(".save-temperature"),
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