import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { ledController } from "../helpers/ledController.js";
import { SaveButton } from "./SaveButton.js";
import { postAjax } from "../helpers/postAjax.js";
import { time } from "../helpers/time.js";
import { date } from "../helpers/date.js";
import { RealTimeDataButton } from "./RealTimeDataButton.js";
import { getAjax } from "../helpers/getAjax.js";

export function Humidity(thingy, boton){
    const d=document,$article=d.createElement("article"),$title = d.createElement("div"),
    $humedad = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,data_x=[],data_y=[];
    let $chart,high=true,normal=true,ifttt=true,shareButton=false,id;

    $article.classList.add("humedad");                            
    $humedad.id="chart-humedad";

    $article.appendChild($title);
    $article.appendChild($humedad);
    $article.appendChild(SaveButton("save-humidity"));
    $article.appendChild(RealTimeDataButton("share-humidity"));
    localStorage.setItem('humidityWarning', 'off');

    function logData(data) {

        $title.innerHTML = `
        <header>Humedad</header>
        Humedad: ${data.detail.value} ${data.detail.unit}`;
        updateData($chart, data.detail.value);
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
            postAjax("/update", JSON.stringify(objeto), 
                function(data){
                    console.log(data.message);
                }, function(error){
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(errorMessage);
            });
        }
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
            //enviar un correo de alerta
            if(ifttt===true){
                ifttt=false;
                let objeto={event: "Humedad",
                    alert:"elevada",
                    value:"más de 65%"    
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
                },300000);
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
        const $shareButton=d.querySelector(".share-humidity");
        
        //activar sensor de humedad
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
                localStorage.setItem('humidityWarning', 'off');
                ledController(thingy);
                $shareButton.removeAttribute("data-active");
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
                });
                localStorage.setItem('shareHumidity', 'off');

            }else{
                console.log("error");
            }          
        }   

        //modo real time data
        if(e.target.getAttribute("class")==="share-humidity"){
            console.log(shareButton);
            if(shareButton===false){
                shareButton=true;
                console.log(`shareButton: ${shareButton}`);
                $shareButton.setAttribute("data-active", "true");

                let objeto={
                    sensor: "Humedad (%)",
                    date:date(),
                    data_x: data_x,
                    data_y: data_y};
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
                    })
                    setTimeout(function(){
                        shareButton=true;
                        localStorage.setItem('shareHumidity', 'on');
                    },500);
                },1000);
            }else if(shareButton===true){
                shareButton=false;
                $shareButton.removeAttribute("data-active");
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
                });
                localStorage.setItem('shareHumidity', 'off');
            }
        }

        if(e.target.getAttribute("class")=="save-humidity"){
            let objeto={
                sensor: "Humedad (%)",
                date:date(),
                data_x: data_x,
                data_y: data_y};
            console.log(date());
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
        e.stopPropagation();
    });
    
    return $article;
}