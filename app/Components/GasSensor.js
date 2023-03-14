import { updateData } from "../helpers/updateData.js";
import { CreateChart } from "./CreateChart.js";
import { time } from "../helpers/time.js";
import { SaveButton } from "./SaveButton.js";
import { date } from "../helpers/date.js";
import { ledController } from "../helpers/ledController.js";
import { postAjax } from "../helpers/postAjax.js";

export function GasSensor(thingy, boton){
    const d=document,$article=d.createElement("article"),$titleCO2 = d.createElement("div"),
    $titleCOV = d.createElement("div"),$CO2 = d.createElement("canvas"),$COV = d.createElement("canvas"),$boton=d.querySelector(boton);
    let estado=0,high=true,normal=true,dataCO2_x=[],dataCO2_y=[],dataCOV_x=[],dataCOV_y=[];
    let $chartCO2, $chartCOV;

    $article.classList.add("gas");

    $CO2.id="chart-CO2";

    $COV.id="chart-COV";

    $article.appendChild($titleCO2);
    $article.appendChild($CO2);
    $article.appendChild($titleCOV);
    $article.appendChild($COV);
    $article.appendChild(SaveButton("save-gas"));

    localStorage.setItem('gasWarning', 'off');

    //funcion para actualizar los datos de las gráficas
    function logData(data) {
        console.log(data);
        dataCO2_y.push(data.detail.eCO2.value);
        dataCO2_x.push(time());
        $titleCO2.innerHTML = `
        <header>CO2</header>
        CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit}`;

        dataCOV_y.push(data.detail.TVOC.value);
        dataCOV_x.push(time());
        $titleCOV.innerHTML = `
        <header>COV</header>
        COV: ${data.detail.TVOC.value} ${data.detail.TVOC.unit}`;

        updateData($chartCO2, data.detail.eCO2.value);
        updateData($chartCOV, data.detail.TVOC.value);

        if(data.detail.eCO2.value>=800){
            $titleCO2.innerHTML = `
            <header>CO2</header>
            CO2: ${data.detail.eCO2.value} ${data.detail.eCO2.unit} (Alto)`;
            localStorage.setItem('gasWarning', 'on');
            $article.classList.add("warning");
            if(high===true){
                ledController(thingy);
                high=false;
                normal=true;
            }
            
        }else{
            localStorage.setItem('gasWarning', 'off');
            $article.classList.remove("warning");
            if(normal===true){
                ledController(thingy);
                high=true;
                normal=false;
            }
        }
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
                $chartCO2=CreateChart("chart-CO2","CO2 (ppm)");
                $chartCOV=CreateChart("chart-COV","COV (ppb)");
                
                console.log($chartCO2);
                console.log($chartCOV);

                console.log(`existe chart: ${$chartCO2}`);
                $article.classList.toggle("is-active");
                start_Gas(thingy);

                
            }else if(estado===1){
                $article.classList.toggle("is-active");
                stop_Gas(thingy);
                localStorage.setItem('gasWarning', 'off');
                ledController(thingy);
                //dato={};

            }else{
                console.log("error");
            }          
        }
        
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
            postAjax("/save", JSON.stringify(objetoCOV), 
            function(data){
                console.log(data);
            },  function(error){
                console.log(error);
            });
        }

        e.stopPropagation();

    });
    
    return $article;
}