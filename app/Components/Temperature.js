import { date } from "../helpers/date.js";
import { getAjax } from "../helpers/getAjax.js";
import { ledController } from "../helpers/ledController.js";
import { postAjax } from "../helpers/postAjax.js";
import { time } from "../helpers/time.js";
import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { RealTimeDataButton } from "./RealTimeDataButton.js";
import { SaveButton } from "./SaveButton.js";
//función encargado de renderizar un panel que muestra la gráfica de los datos del sensor de temperatura enviados por el dispositivo thingy 52
export function Temperature(thingy, boton, limiteTemperatura){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $temperatura = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,data_x=[],data_y=[];
    let $chart, high=true,low=true,normal=true,ifttt=true,shareButton=false,id;

    $article.classList.add("temperatura");                            
    $temperatura.id="chart-temperatura";

    $title.classList.add("title"); 

    $article.appendChild($title);
    $article.appendChild($temperatura);
    //Renderizar botón de guardar datos
    $article.appendChild(SaveButton("save-temperature"));
    //Renderizar botón de activar el modo remoto
    $article.appendChild(RealTimeDataButton("share-temperature"));
    localStorage.setItem('temperatureWarning', 'off');
    //funcion para actualizar los datos de las gráficas
    function logData(data) {
        //Renderizar datos del sensor temperatura
        $title.innerHTML = `
        <header>Temperatura</header>
        Temperature: ${data.detail.value} ${data.detail.unit}`;
        //actualizar gráfica
        updateData($chart, data.detail.value);
        //Actualizar datos de temperatura
        data_y.push(data.detail.value);
        data_x.push(time());

        //actualizar datos compartidos
        if(shareButton===true){
            console.log("actualizando datos temperatura");
            console.log(id);
            let objeto={
                id:id,
                sensor: "Temperatura (ºC)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            //enviar nuevos datos actualizados a la base de datos
            postAjax("/update", JSON.stringify(objeto), 
                function(data){
                    console.log(data.message);
                }, function(error){
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(errorMessage);
            });
        }
        //activación de alerta cuando se supera un valor límite
        if(data.detail.value>=limiteTemperatura.max/*38*/){
            //Renderizar datos del sensor temperatura
            $title.innerHTML = `
            <header>Temperatura</header>
            Temperature: ${data.detail.value} ${data.detail.unit} (Warning: Temperatura elevada)`;
            localStorage.setItem('temperatureWarning', 'on');
            $article.classList.add("warning");
            //Modificar color de led RGB del dispositivo
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
            //enviar un correo de alerta
            if(ifttt===true){
                ifttt=false;
                let objeto={event: "sensor",
                    sensor:"Temperatura",
                    alert:"elevada",
                    value:"más de 38º"    
                };
                //enviar datos al lado de servidor
                postAjax("/ifttt",
                    JSON.stringify(objeto),
                    function(data){
                        console.log(data.message);
                    },  function(error){
                         console.log(error);
                    }
                );
                //esperar 5 min para volver a enviar un correo
                setTimeout(async function(){
                    ifttt=true;
                },300000);
            }
        //activación de alerta cuando se baja de un valor límite
        }else if (data.detail.value<=limiteTemperatura.min/*10*/){
            //Renderizar datos del sensor temperatura
            $title.innerHTML = `
            <header>Temperatura</header>
            Temperature: ${data.detail.value} ${data.detail.unit} (Warning: Temperatura baja)`;
            localStorage.setItem('temperatureWarning', 'on');
            $article.classList.add("warning");
            //Modificar color de led RGB del dispositivo
            if(low===true){
                ledController(thingy);
                low=false;
                normal=true;
            }
            //enviar un correo de alerta
            if(ifttt===true){
                ifttt=false;
                let objeto={event: "sensor",
                    sensor:"Temperatura",
                    alert:"baja",
                    value:"menos de 10º"    
                };
                //enviar datos al lado de servidor
                postAjax("/ifttt",
                    JSON.stringify(objeto),
                        function(data){
                        console.log(data.message);
                    },  function(error){
                      console.log(error);
                    }
                    );
                //esperar 5 min para volver a enviar un correo
                setTimeout(async function(){
                    ifttt=true;
                },300000);
            }
        }else{
            //desactivación de alerta
            localStorage.setItem('temperatureWarning', 'off');
            $article.classList.remove("warning");
            //Modificar color de led RGB del dispositivo
            if(normal===true){
                ledController(thingy);
                high=true;
                low=true;
                normal=false;
            }
        }
    }
    //empezar la lectura del sensor de temperatura
    async function start_Temperatura(device) {
        try{
            let bool=await device.temperature.start();
            //espera de evento, que es recibir datos del sensor del dispositivo
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
    //parada de la lectura del sensor de temperatura
    async function stop_Temperatura(device) {
        try{
            let bool=await device.temperature.stop();
            localStorage.setItem('temperatureWarning', 'off');
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
    //esperar evento click del ratón
    d.addEventListener("click", async function(e){
        const $shareButton=d.querySelector(".share-temperature");
        //activar sensor de temperatura
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){
           
            if(estado===0){
                //crear gráficas
                $chart=CreateChart("chart-temperatura","Temperatura (ºC)");
                console.log($chart);
                $article.classList.toggle("is-active");
                //empezar lectura del sensor de temperatura
                start_Temperatura(thingy);
            }else if(estado===1){
                $article.classList.toggle("is-active");
                //parar lectura del sensor de temperatura
                stop_Temperatura(thingy);
                localStorage.setItem('temperatureWarning', 'off');
                //actualizar el color del led RGB
                ledController(thingy);
                $shareButton.removeAttribute("data-active");
                //asegurar que no se comparta datos del modo remoto cuando se desactiva el sensor
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="Temperatura (ºC)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir temperatura");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareTemperature', 'off');
            }else{
                console.log("error");
            }          
        }   
        //pulsado el boton de modo remoto se produce la activación de modo remoto 
        if(e.target.getAttribute("class")==="share-temperature"){
            console.log(shareButton);
            if(shareButton===false){
                console.log(`shareButton: ${shareButton}`);
                $shareButton.setAttribute("data-active", "true");
                //estructura de datos que se va a enviar al lado del servidor
                let objeto={
                    sensor: "Temperatura (ºC)",
                    date:date(),
                    data_x: data_x,
                    data_y: data_y};
                //enviar datos al lado del servidor, y desde el lado del servidor enviarlo a la base de datos
                postAjax("/share", JSON.stringify(objeto), 
                function(data){
                    const d=document,$panel=d.querySelector(".share-temperature"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
                    },  function(error){
                    const d=document,$panel=d.querySelector(".share-temperature"),
                    $newMessage=$panel.parentElement.querySelector(".message");
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(error.status);
                    $newMessage.innerHTML=`<b>Error ${error.status}: ${errorMessage}</b>`;
                    $newMessage.classList.add("error"); 
                    setTimeout(function(){
                        $newMessage.classList.remove("error"); 
                    },3000);
                });
                setTimeout(function(){
                    getAjax("/remote",function(data){
                        data.forEach(el => {
                            if(el.sensor==="Temperatura (ºC)"){
                                id=el._id;
                            }
                        });
                    },function(error){
                        console.log(error);
                    })
                    setTimeout(function(){
                        shareButton=true;
                        localStorage.setItem('shareTemperature', 'on');
                    },500);
                },1000);
            //cuando el botón de modo remoto está desactivado        
            }else if(shareButton===true){
                shareButton=false;
                $shareButton.removeAttribute("data-active");
                //parar de compartir datos a la base de datos
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="Temperatura (ºC)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir temperatura");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareTemperature', 'off');
            }
        }
        //pulsado el botón guardar, se guarda los datos recibidos del dispositivo thingy 52
        if(e.target.getAttribute("class")=="save-temperature"){
            let objeto={
                sensor: "Temperatura (ºC)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            console.log(date());
            //enviar los datos de temperatura que se van a guardar en la base de datos al lado del servidor
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
        //evitar la propagación del mismo evento (en este caso el click de ratón) al ser llamado
        e.stopPropagation();
    });
    
    return $article;
}