
import { getAjax } from "../helpers/getAjax.js";
import { CreateChart } from "./CreateChart.js";
//función encargado de renderizar los datos guardados en la base de datos
//los datos pertenecen a los sensores que tiene el modo remoto activado
export function RenderRealTimeData(){
    const d=document,$dataBase=d.querySelector(".realTimeData"),$userMenu=d.querySelector(".userMenu"),
    $dataBaseTitle= d.createElement("div"),$dataBaseContent= d.createElement("div"),$error= d.createElement("div");
    $dataBaseContent.classList.add("realTimeDataContent");
    $dataBaseTitle.classList.add("realTimeDataTitle");
    $error.classList.add("realTimeDataError");
    $dataBaseTitle.innerHTML=`<u><b>Datos en Tiempo Real</b></u>`;
    //mostrar error en caso de no hay datos guardados en la base de datos
    $error.innerHTML=`No se está compartiendo datos`;
    $error.style.display="block";
    $dataBase.appendChild($dataBaseTitle);
    $dataBase.appendChild($error);
    $dataBase.appendChild($dataBaseContent);
    let shareTemperature, shareHumidity, shareGas;
    //esperar un evento click del ratón
    $userMenu.addEventListener("click", e => {
        //si se pulsa el botón de modo remoto
        if (e.target.matches(".realTimeDataLink")) {
            console.log("estoy en realTimeData");
            //enviar petición por Ajax al lado del servidor para obtener los datos del modo remoto de la base de datos 
            getAjax("/remote",function(data){
                let html=``;
                if(!data.length){
                    $error.style.display="block";
                }else{
                    $error.style.display="none";
                }
                //una vez obtenido los datos se renderizan en la aplicación 
                data.forEach(el => {
                    html+=`
                    <div class="dataPanel">
                        <div class="panelHeader">
                            &nbsp;<h2>${el.sensor} &nbsp;&nbsp;&nbsp;&nbsp; ${el.date}<h2>
                        </div>
                        <div class="canvasChartRTD">
                            <canvas id="${el._id}"></canvas>
                        </div>
                    </div>
                    `;
                    
                });
                d.querySelector(".realTimeDataContent").innerHTML=html;
                //crear las gráficas
                data.forEach(el =>{
                    let $chart=CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                    let interval=setInterval(function(){
                        shareTemperature=localStorage.getItem('shareTemperature');
                        shareHumidity=localStorage.getItem('shareHumidity');
                        shareGas=localStorage.getItem('shareGas');
                        //hacer peticion al lado de servidor para obtener los datos del modo remoto actualizados 
                        getAjax(`/findOne/${el._id}`,function(el){
                            console.log($chart);
                            //actualizar la gráfica
                            $chart.data.datasets.forEach((dataset) => {
                                if(dataset.data.length < el.data_x.length){
                                    let resto=el.data_x.length-dataset.data.length;
                                    for (let i = el.data_x.length-resto; i < el.data_x.length; i++) {
                                        dataset.data.push(`${el.data_y[i]}`);
                                        $chart.data.labels.push(`${el.data_x[i]}`);
                                        $chart.update();
                                    }
                                }
                            });    
                        },function(error){
                            //mostrar error de petición
                            console.log(error);
                            //cancelar la función de setInterval
                            clearInterval(interval);
                        });
                    }, 2000);
                }
                )
            },function(error){
                //mostrar error de petición
                console.log(error);
            });

        }
    });
}