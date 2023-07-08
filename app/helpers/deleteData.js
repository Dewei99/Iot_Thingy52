
import { CreateChart } from "../Components/CreateChart.js";
import { average } from "./average.js";
import { getAjax } from "./getAjax.js";
import { readTime } from "./readTime.js";
//función que realiza el proceso de eliminación de datos de la base de datos
export function deleteData(){
    const d=document,$dataBase=d.querySelector(".dataBase"),
    $deleteMessage=d.querySelector(".deleteMessage");
    const $error=d.querySelector(".dataBaseError");
    $dataBase.addEventListener("mouseup",(e)=>{
        let confirmacion;
        console.log(e.target.getAttribute("class"));
        //abrir ventana de confirmación de eliminar
        if (e.target.getAttribute("class")=="eliminar"){
            let element = e.target;
            
            let parent =element.parentElement;
            confirmacion= parent.querySelector(".confirmacion");
            confirmacion.classList.add("is-active"); 
        };

        //cancelar proceso de eliminación
        if (e.target.getAttribute("class")=="cancelar"){
            let element = e.target;
            element.parentElement.classList.remove("is-active"); 
        };
        //esperar evento click del ratón al botón eliminar
        if(e.target.getAttribute("class")=="deleteBtn"){
            let delete_id=e.target.getAttribute("data-delete");
            console.log(e.target.getAttribute("data-delete"));
            //petición al lado del sevidor para eliminar datos de la base de datos
            getAjax(`/delete/${delete_id}`,
                function(data){
                    if(data.success==true){
                        $deleteMessage.classList.add("is-active");
                        //volver a renderizar los datos guardados en la base de datos
                        setTimeout(function(){
                            $deleteMessage.classList.remove("is-active");
                            getAjax("/database",function(data){
                                let html=``;
                                console.log($error.style.display);
                                if(!data.length){
                                    $error.style.display="block";
                                }else{
                                    $error.style.display="none";
                                }
                                data.forEach(el => {
                                    let media=average(el.data_y),tiempo=readTime(el.data_x),
                                    valorMax=Math.max(...el.data_y),valorMin=Math.min(...el.data_y);
                                    html+=`
                                    <div class="dataPanel" >
                                        <div class="panelHeader">
                                            <img src="/assets/flecha.png" alt="flecha" data-class="arrow" data-id="${el._id}"/>
                                            <h2>${el.sensor} &nbsp;&nbsp;&nbsp;&nbsp; ${el.date}</h2>
                                            <button type="button" class="eliminar" data-delete="${el._id}">Borrar</button>
                                            <div class="confirmacion">
                                                <h2>¿Estás seguro?</h2><br>
                                                <button type="button" class="deleteBtn" data-delete="${el._id}">Aceptar</button>
                                                &nbsp;
                                            <button type="button" class="cancelar" data-cancelar">Cancelar</button>
                                        </div>
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
                                d.querySelector(".dataBaseContent").innerHTML=html;
                
                                data.forEach(el =>{
                                    CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                                }
                                )
                            },function(error){
                                console.log(error);
                            }); 
                        },2500);
                        console.log("volver a renderizar datos");

                    }
                },function(error){
                    console.log(error);
                }
            )
            
            //cerrar ventana
            let element = e.target;
            element.parentElement.classList.remove("is-active");
        };
        //desplegar o cerrar la gráfica
        if(e.target.getAttribute("data-class")=="arrow"){
            let element = e.target;//d.querySelector("img");
            console.log(element);
            element.classList.toggle("is-active");
            let $panelData=d.getElementById(`${e.target.getAttribute("data-id")}`);
            console.log($panelData.parentElement);
            $panelData.parentElement.classList.toggle("is-active");
        };
       //evitar la propagación del mismo evento (en este caso el click de ratón) al ser llamado
        e.stopPropagation();
    })


}