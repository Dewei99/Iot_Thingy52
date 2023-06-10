import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { time } from "../helpers/time.js";
import { SaveButton } from "./SaveButton.js";
import { date } from "../helpers/date.js";
import { ledController } from "../helpers/ledController.js";
import { postAjax } from "../helpers/postAjax.js";
import { RealTimeDataButton } from "./RealTimeDataButton.js";
import { getAjax } from "../helpers/getAjax.js";

//función encargado de renderizar un panel que muestra la gráfica de los datos del sensor de gas enviados por el dispositivo thingy 52
export function GasSensor(thingy, boton,limiteCO2,limiteCOV){
    const d=document,$article=d.createElement("article"),$titleCO2 = d.createElement("div"),
    $titleCOV = d.createElement("div"),$CO2 = d.createElement("canvas"),$COV = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,high=true,normal=true,dataCO2_x=[],dataCO2_y=[],dataCOV_x=[],dataCOV_y=[];
    let $chartCO2, $chartCOV,iftttCO2=true,iftttCOV=true,shareButton=false,id_CO2,id_COV;

    $article.classList.add("gas");

    $CO2.id="chart-CO2";

    $COV.id="chart-COV";

    $article.appendChild($titleCO2);
    $article.appendChild($CO2);
    $article.appendChild($titleCOV);
    $article.appendChild($COV);
    //Renderizar botón de guardar datos
    $article.appendChild(SaveButton("save-gas"));
    //Renderizar botón de activar el modo remoto
    $article.appendChild(RealTimeDataButton("share-gas"));
    localStorage.setItem('gasWarning', 'off');

    //funcion para actualizar los datos de las gráficas
    function logData(data) {
        console.log(data);
        //Actualizar datos de CO2
        dataCO2_y.push(data.detail.eCO2.value);
        dataCO2_x.push(time());
        //Renderizar datos del sensor CO2
        $titleCO2.innerHTML = `
        <header>CO2</header>
        CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit}`;
        //Actualizar datos de COV
        dataCOV_y.push(data.detail.TVOC.value);
        dataCOV_x.push(time());
        //Renderizar datos del sensor COV
        $titleCOV.innerHTML = `
        <header>COV</header>
        COV: ${data.detail.TVOC.value} ${data.detail.TVOC.unit}`;
        //actualizar gráfica
        updateData($chartCO2, data.detail.eCO2.value);
        updateData($chartCOV, data.detail.TVOC.value);
        
        
        //actualizar datos compartidos del modo remoto
        if(shareButton===true){
            console.log("actualizando datos gas");
            let objeto_CO2={
                id:id_CO2,
                sensor: "CO2 (ppm)",
                date:date(),
                data_x: dataCO2_x,
                data_y: dataCO2_y};
            let objeto_COV={
                id:id_COV,
                sensor: "COV (ppb)",
                date:date(),
                data_x: dataCOV_x,
                data_y: dataCOV_y};
            //enviar nuevos datos actualizados a la base de datos
            postAjax("/update", JSON.stringify(objeto_CO2), 
                function(data){
                    console.log(data.message);
                }, function(error){
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(errorMessage);
            });
            postAjax("/update", JSON.stringify(objeto_COV), 
            function(data){
                console.log(data.message);
            }, function(error){
                let errorMessage= error.statusText||error.message || "Ocurrió un error";
                console.log(errorMessage);
        });
        }
        //activación de alerta cuando se supera un valor límite
        if(data.detail.eCO2.value>=limiteCO2/*1000*/){
            //Renderizar datos del sensor CO2
            $titleCO2.innerHTML = `
            <header>CO2</header>
            CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit} (Alto)`;
            localStorage.setItem('gasWarning', 'on');
            $article.classList.add("warning");
            //Modificar color de led RGB del dispositivo
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
            //enviar un correo de alerta
            if(iftttCO2===true){
                iftttCO2=false;
                let objeto={event: "sensor",
                    sensor:"CO2",
                    alert:"elevada",
                    value:`más de ${limiteCO2} ppm`    
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
                    iftttCO2=true;
                },300000);
            }
        }else{
            //desactivación de alerta
            localStorage.setItem('gasWarning', 'off');
            $article.classList.remove("warning");
            //Modificar color de led RGB del dispositivo
            if(normal===true){
                ledController(thingy);
                high=true;
                normal=false;
            }
        }
        //activación de alerta cuando se supera un valor límite
        if(data.detail.TVOC.value>=limiteCOV/*500*/){
            //Renderizar datos del sensor COV
            $titleCOV.innerHTML = `
            <header>COV</header>
            COV: ${data.detail.TVOC.value} ${data.detail.TVOC.unit} (Alto)`;
            localStorage.setItem('gasWarning', 'on');
            $article.classList.add("warning");
            //Modificar color de led RGB del dispositivo
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
            //enviar un correo de alerta
            if(iftttCOV===true){
                iftttCOV=false;
                let objeto={event: "sensor",
                    sensor:"COV",
                    alert:"elevada",
                    value:`más de ${limiteCOV} ppb`    
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
                    iftttCOV=true;
                },300000);
            }  
        }else{
            localStorage.setItem('gasWarning', 'off');
            $article.classList.remove("warning");
            if(normal===true){
                //cambiar color de led RGB del dispositivo Thingy 52
                ledController(thingy);
                high=true;
                normal=false;
            }
        }
    }

    //empezar la lectura del sensor de gas
    async function start_Gas(device) {
        try{
            let bool=await device.gas.start();
            //espera de evento, que es recibir datos del sensor del dispositivo
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
    //parada de la lectura del sensor de gas
    async function stop_Gas(device) {
        try{
            let bool=await device.gas.stop();
            localStorage.setItem('gasWarning', 'off');
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

    //esperar evento click del ratón
    d.addEventListener("click", async function(e){
        const $shareButton=d.querySelector(".share-gas");
          //activar sensor de gas
        if(e.target.matches(boton)||e.target.matches(`${boton} *`)){

            if(estado===0){
                //crear gráficas
                $chartCO2=CreateChart("chart-CO2","CO2 (ppm)");
                $chartCOV=CreateChart("chart-COV","COV (ppb)");
                
                console.log($chartCO2);
                console.log($chartCOV);

                console.log(`existe chart: ${$chartCO2}`);
                $article.classList.toggle("is-active");
                //empezar lectura del sensor de gas
                start_Gas(thingy);

            }else if(estado===1){
                $article.classList.toggle("is-active");
                //parar lectura del sensor de gas
                stop_Gas(thingy);
                localStorage.setItem('shareGas', 'off');
                //actualizar el color del led RGB
                ledController(thingy);
                $shareButton.removeAttribute("data-active");
                //asegurar que no se comparta datos del modo remoto cuando se desactiva el sensor
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="CO2 (ppm)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir CO2");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                        if(el.sensor==="COV (ppb)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir COV");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareGas', 'off');
                
            }else{
                console.log("error");
            }          
        }
        //pulsado el boton de modo remoto se produce la activación de modo remoto 
        if(e.target.getAttribute("class")==="share-gas"){
            console.log(shareButton);
            if(shareButton===false){
                shareButton=true;
                console.log(`shareButton: ${shareButton}`);
                $shareButton.setAttribute("data-active", "true");
                //estructura de datos que se va a enviar al lado del servidor
                let objeto_CO2={
                    id:id_CO2,
                    sensor: "CO2 (ppm)",
                    date:date(),
                    data_x: dataCO2_x,
                    data_y: dataCO2_y};
                let objeto_COV={
                    id:id_COV,
                    sensor: "COV (ppb)",
                    date:date(),
                    data_x: dataCOV_x,
                    data_y: dataCOV_y};
                //enviar datos al lado del servidor, y desde el lado del servidor enviarlo a la base de datos
                postAjax("/share", JSON.stringify(objeto_CO2), 
                function(data){
                    const d=document,$panel=d.querySelector(".share-gas"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
                    },  function(error){
                    const d=document,$panel=d.querySelector(".share-gas"),
                    $newMessage=$panel.parentElement.querySelector(".message");
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(error.status);
                    $newMessage.innerHTML=`<b>Error ${error.status}: ${errorMessage}</b>`;
                    $newMessage.classList.add("error"); 
                    setTimeout(function(){
                        $newMessage.classList.remove("error"); 
                    },3000);
                });
                //enviar datos al lado del servidor
                postAjax("/share", JSON.stringify(objeto_COV), 
                function(data){ console.log(data);
                },  function(error){ console.log(error); });
                setTimeout(function(){
                    getAjax("/remote",function(data){
                        data.forEach(el => {
                            if(el.sensor==="CO2 (ppm)"){
                                id_CO2=el._id;
                            }else if(el.sensor==="COV (ppb)"){
                                id_COV=el._id;
                            }
                        });
                    },function(error){
                        console.log(error);
                    })
                    setTimeout(function(){
                        shareButton=true;
                        localStorage.setItem('shareGas', 'on');
                    },500);
                },1000);}
                //cuando el botón de modo remoto está desactivado
                else if(shareButton===true){
                shareButton=false;
                $shareButton.removeAttribute("data-active");
                //parar de compartir datos a la base de datos
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        if(el.sensor==="CO2 (ppm)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir CO2");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }

                        if(el.sensor==="COV (ppb)"){
                            getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir COV");
                                }
                            },function(error){
                                console.log(error);
                            });
                        }
                    });
                },function(error){
                    console.log(error);
                });
                localStorage.setItem('shareGas', 'off');
            }
        }
        //pulsado el botón guardar, se guarda los datos recibidos del dispositivo thingy 52
        if(e.target.getAttribute("class")=="save-gas"){
            let objetoCO2={
                sensor: "CO2 (ppm)",
                date:date(),
                data_x: dataCO2_x,
                data_y: dataCO2_y};
            let objetoCOV={
                sensor: "COV (ppb)",
                date:date(),
                data_x: dataCOV_x,
                data_y: dataCOV_y};    
            console.log(date());
            //enviar los datos de CO2 que se van a guardar en la base de datos al lado del servidor
            postAjax("/save", JSON.stringify(objetoCO2), 
                function(data){
                    const d=document,$panel=d.querySelector(".save-gas"),
                    $message=$panel.parentElement.querySelector(".message");
                    $message.innerHTML=`${data.message}`;
                    $message.classList.add("success"); 
                    setTimeout(function(){
                        $message.classList.remove("success"); 
                    },3000);
            },  function(error){
                    const d=document,$panel=d.querySelector(".save-gas"),
                    $newMessage=$panel.parentElement.querySelector(".message");
                    let errorMessage= error.statusText||error.message || "Ocurrió un error";
                    console.log(error.status);
                    $newMessage.innerHTML=`<b>Error ${error.status}: ${errorMessage}</b>`;
                    $newMessage.classList.add("error"); 
                    setTimeout(function(){
                        $newMessage.classList.remove("error"); 
                    },3000);
                    
            });
            //enviar los datos de COV que se van a guardar en la base de datos al lado del servidor
            postAjax("/save", JSON.stringify(objetoCOV), 
            function(data){
                console.log(data);
            },  function(error){
                console.log(error);
            });
        }
        //evitar la propagación del mismo evento (en este caso el click de ratón) al ser llamado
        e.stopPropagation();

    });
    
    return $article;
}