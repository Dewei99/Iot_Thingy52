import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { ledController } from "../helpers/ledController.js";
import { SaveButton } from "./SaveButton.js";
import { postAjax } from "../helpers/postAjax.js";
import { time } from "../helpers/time.js";
import { date } from "../helpers/date.js";
import { RealTimeDataButton } from "./RealTimeDataButton.js";
import { getAjax } from "../helpers/getAjax.js";
//función encargado de renderizar un panel que muestra la gráfica de los datos del sensor de humedad enviados por el dispositivo thingy 52
export function Humidity(thingy, boton){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $humedad = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,data_x=[],data_y=[];
    let $chart,high=true,normal=true,ifttt=true,shareButton=false,id;

    $article.classList.add("humedad");                            
    $humedad.id="chart-humedad";

    $article.appendChild($title);
    $article.appendChild($humedad);
    //Renderizar botón de guardar datos
    $article.appendChild(SaveButton("save-humidity"));
    //Renderizar botón de activar el modo remoto
    $article.appendChild(RealTimeDataButton("share-humidity"));
    localStorage.setItem('humidityWarning', 'off');

    //funcion para actualizar los datos de las gráficas
    function logData(data) {
        //Renderizar datos del sensor humedad
        $title.innerHTML = `
        <header>Humedad</header>
        Humedad: ${data.detail.value} ${data.detail.unit}`;
        //actualizar gráfica
        updateData($chart, data.detail.value);
        //Actualizar datos de humedad
        data_y.push(data.detail.value);
        data_x.push(time());
        
        //actualizar datos compartidos
        if(shareButton===true){
            console.log("actualizando datos temperatura");
            console.log(id);
            let objeto={
                id:id,
                sensor: "Humedad (%)",
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
        if(data.detail.value>=65){
            //Renderizar datos del sensor humedad
            $title.innerHTML = `
            <header>Humedad</header>
            Humedad: ${data.detail.value} ${data.detail.unit} (Alto)`;
            updateData($chart, data.detail.value);
            localStorage.setItem('humidityWarning', 'on');
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
                let objeto={event: "Humedad",
                    alert:"elevada",
                    value:"más de 65%"    
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
            localStorage.setItem('humidityWarning', 'off');
            $article.classList.remove("warning");
            //Modificar color de led RGB del dispositivo
            if(normal===true){
                ledController(thingy);
                high=true;
                normal=false;
            }
        }
    }

    //empezar la lectura del sensor de humedad
    async function start_Humedad(device) {
        try{
            let bool=await device.humidity.start();
            //espera de evento, que es recibir datos del sensor del dispositivo
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
    //parada de la lectura del sensor de humedad
    async function stop_Humedad(device) {
        try{
            let bool=await device.humidity.stop();
            localStorage.setItem('humidityWarning', 'off');
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
    //esperar evento click del ratón
    d.addEventListener("click", async function(e){
        const $shareButton=d.querySelector(".share-humidity");
        //activar sensor de humedad
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                //crear gráficas
                $chart=CreateChart("chart-humedad","Humedad (%)");
                console.log($chart);
                $article.classList.toggle("is-active");
                //empezar lectura del sensor de humedad
                start_Humedad(thingy);
            }else if(estado===1){
                $article.classList.toggle("is-active");
                //parar lectura del sensor de humedad
                stop_Humedad(thingy);
                localStorage.setItem('humidityWarning', 'off');
                //actualizar el color del led RGB
                ledController(thingy);
                $shareButton.removeAttribute("data-active");
                //asegurar que no se comparta datos del modo remoto cuando se desactiva el sensor
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="Humedad (%)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir datos de humedad");
                                }
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareHumidity', 'off');

            }else{
                console.log("error");
            }          
        }   

        //pulsado el boton de modo remoto se produce la activación de modo remoto 
        if(e.target.getAttribute("class")==="share-humidity"){
            console.log(shareButton);
            if(shareButton===false){
                shareButton=true;
                console.log(`shareButton: ${shareButton}`);
                $shareButton.setAttribute("data-active", "true");
                //estructura de datos que se va a enviar al lado del servidor
                let objeto={
                    sensor: "Humedad (%)",
                    date:date(),
                    data_x: data_x,
                    data_y: data_y};
                //enviar datos al lado del servidor, y desde el lado del servidor enviarlo a la base de datos
                postAjax("/share", JSON.stringify(objeto), 
                function(data){
                    const d=document,$panel=d.querySelector(".share-humidity"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
                    },  function(error){
                    const d=document,$panel=d.querySelector(".share-humidity"),
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
                            if(el.sensor==="Humedad (%)"){
                                id=el._id;
                            }
                        });
                    },function(error){
                        console.log(error);
                    })
                    setTimeout(function(){
                        shareButton=true;
                        localStorage.setItem('shareHumidity', 'on');
                    },500);
                },1000);
            //cuando el botón de modo remoto está desactivado
            }else if(shareButton===true){
                shareButton=false;
                $shareButton.removeAttribute("data-active");
                //parar de compartir datos a la base de datos
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="Humedad (%)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir datos de humedad");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareHumidity', 'off');
            }
        }
        //pulsado el botón guardar, se guarda los datos recibidos del dispositivo thingy 52
        if(e.target.getAttribute("class")=="save-humidity"){
            let objeto={
                sensor: "Humedad (%)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            console.log(date());
            //enviar los datos de humedad que se van a guardar en la base de datos al lado del servidor
            postAjax("/save", JSON.stringify(objeto), 
                function(data){
                    const d=document,$panel=d.querySelector(".save-humidity"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
            },  function(error){
                    const d=document,$panel=d.querySelector(".save-humidity"),
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