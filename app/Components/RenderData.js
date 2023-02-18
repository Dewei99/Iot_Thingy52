import { average } from "../helpers/average.js";
import { getAjax } from "../helpers/getAjax.js";
import { readTime } from "../helpers/readTime.js";
import { CreateChart } from "./CreateChart.js";

export function RenderData(){
    
    const d=document,$dataBase=d.querySelector(".dataBase"),$userMenu=d.querySelector(".userMenu");
    $userMenu.addEventListener("click", e => {
        if (e.target.matches(".databaseLink")) {
            
            getAjax("/database",function(data){
                let html=``;
                data.forEach(el => {
                    let media=average(el.data_y),tiempo=readTime(el.data_x),
                    valorMax=Math.max(...el.data_y),valorMin=Math.min(...el.data_y);
                    html+=`
                    <div class="dataPanel">
                        <div class="panelHeader">
                            <img src="../app/assets/flecha.png" alt="flecha" data-class="arrow" data-id="${el._id}"/>
                            <h2>${el.sensor} &nbsp;&nbsp;&nbsp;&nbsp; ${el.date}<h2>
                            <button type="button" class="deleteBtn" data-delete="${el._id}">Delete</button>
                        </div>
                        <div class="resultados">
                            Media=${media}&nbsp;&nbsp;&nbsp; Valor Máx=${valorMax}&nbsp;&nbsp;&nbsp; Valor Mín=${valorMin}&nbsp;&nbsp;&nbsp;Tiempo Lectura=${tiempo}
                        </div>
                        <div class="canvasChart">
                            <canvas id="${el._id}"></canvas>
                        </div>
                       
                    </div>
                    `;
                    
                });
                d.querySelector(".dataBase").innerHTML=html;

                data.forEach(el =>{
                    let $chart=CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                   
                }
                )
            });
        }


    
    });

    /*$dataBase.addEventListener("mouseup",(e)=>{
        console.log(e.target.getAttribute("class"));
        if(e.target.getAttribute("class")=="deleteBtn"){
            console.log(e.target.getAttribute("data-delete"));
            getAjax("")
        };

        if(e.target.getAttribute("data-class")=="arrow"){
            let element = e.target;//d.querySelector("img");
            console.log(element);
            element.classList.toggle("is-active");
            //let $panelData=d.getElementsByClassName(e.target.getAttribute("data-id"));
            let $panelData=d.getElementById(`${e.target.getAttribute("data-id")}`);
            //let $panelData=d.querySelector(".63d57b8f5cc4c6255fdc3609");
            console.log($panelData.parentElement);
            $panelData.parentElement.classList.toggle("is-active");
 
           // $panelData.style.display="none";
        };
       
        
        e.stopPropagation();
    })*/
}