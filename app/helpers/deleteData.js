
import { CreateChart } from "../Components/CreateChart.js";
import { average } from "./average.js";
import { getAjax } from "./getAjax.js";
import { readTime } from "./readTime.js";

export function deleteData(){
    const d=document,$dataBase=d.querySelector(".dataBase"),
    $deleteMessage=d.querySelector(".deleteMessage");
    //$deleteMessage.innerHTML="Eliminado correctamente";
    $dataBase.addEventListener("mouseup",(e)=>{
        console.log(e.target.getAttribute("class"));
        if(e.target.getAttribute("class")=="deleteBtn"){
            let delete_id=e.target.getAttribute("data-delete");
            console.log(e.target.getAttribute("data-delete"));
            getAjax(`/delete/${delete_id}`,
                function(data){
                    if(data.success==true){
                        
                        $deleteMessage.classList.add("is-active"); 
                        setTimeout(function(){
                            $deleteMessage.classList.remove("is-active");
                            getAjax("/database",function(data){
                                let html=``;
                                data.forEach(el => {
                                    let media=average(el.data_y),tiempo=readTime(el.data_x),
                                    valorMax=Math.max(...el.data_y),valorMin=Math.min(...el.data_y);
                                    html+=`
                                    <div class="dataPanel">
                                        <div class="panelHeader">
                                            <img src="/assets/flecha.png" alt="flecha" data-class="arrow" data-id="${el._id}"/>
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
                                    CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                                }
                                )
                            }); 
                        },2500);
                        console.log("volver a renderizar datos");

                    }
                }
            )
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
    })


}