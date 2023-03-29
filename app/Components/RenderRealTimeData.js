//import { average } from "../helpers/average.js";
import { getAjax } from "../helpers/getAjax.js";
import { updateData } from "../helpers/updateData.js";
//import { readTime } from "../helpers/readTime.js";
import { CreateChart } from "./CreateChart.js";

export function RenderRealTimeData(){
    let arrayCharts=[];
    const d=document,$dataBase=d.querySelector(".realTimeData"),$userMenu=d.querySelector(".userMenu"),
    $dataBaseTitle= d.createElement("div"),$dataBaseContent= d.createElement("div");
    $dataBaseContent.classList.add("realTimeDataContent");
    $dataBaseTitle.classList.add("realTimeDataTitle");
    $dataBaseTitle.innerHTML=`<u><b>Datos en Tiempo Real</b></u>`;
    $dataBase.appendChild($dataBaseTitle);
    $dataBase.appendChild($dataBaseContent);
    let shareTemperature, shareHumidity, shareGas;
    $userMenu.addEventListener("click", e => {
        if (e.target.matches(".realTimeDataLink")) {
            console.log("estoy en realTimeData");
            getAjax("/realTimeData",function(data){
                let html=``;
                arrayCharts=[];
                data.forEach(el => {
                    /*let media=average(el.data_y),tiempo=readTime(el.data_x),
                    valorMax=Math.max(...el.data_y),valorMin=Math.min(...el.data_y);*/
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

                data.forEach(el =>{
                    let $chart=CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                    setInterval(function(){
                        shareTemperature=localStorage.getItem('shareTemperature');
                        shareHumidity=localStorage.getItem('shareHumidity');
                        shareGas=localStorage.getItem('shareGas');

                        getAjax(`/findOne/${el._id}`,function(el){
                            //let $chart=d.getElementById(el._id);
                          //arrayCharts.forEach(el)
                        console.log($chart);
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
                        });

                        /*if((shareTemperature=='on'||shareHumidity=='on'||shareGas=='on')){
                            getAjax(`/findOne/${el._id}`,function(el){
                                    //let $chart=d.getElementById(el._id);
                                  //arrayCharts.forEach(el)
                                console.log($chart);
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
                            });
                            console.log($chart.data.datasets);
                            console.log($chart.data.labels);
                        }*/
                    }, 2000);
                    //arrayCharts.push($chart);
                }
                )
            });

       /*     setInterval(function(){
                shareTemperature=localStorage.getItem('shareTemperature');
                shareHumidity=localStorage.getItem('shareHumidity');
                shareGas=localStorage.getItem('shareGas');
                if((shareTemperature=='on'||shareHumidity=='on'||shareGas=='on')){
                    getAjax("/realTimeData",function(data){
                        data.forEach(el =>{
                            //let $chart=d.getElementById(el._id);
                          //arrayCharts.forEach(el)
                            console.log($chart);
                            //console.log($chart.data.datasets);
                            $chart.data.datasets.forEach((dataset) => {

                                if(dataset.data.length < el.data_x.length){
                                    let resto=el.data_x.length-dataset.data.length;
                                    for (let i = el.data_x.length-resto; i < el.data_x.length; i++) {
                                        dataset.data.push(el.data_x[i]);
                                        $chart.data.labels.push(el.data_y[i]);
                                        $chart.update();
                                    }
                                }
                            });
                        })
                    });
                }
            }, 2000);*/
        }
    });
}