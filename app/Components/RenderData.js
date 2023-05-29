import { average } from "../helpers/average.js";
import { getAjax } from "../helpers/getAjax.js";
import { readTime } from "../helpers/readTime.js";
import { CreateChart } from "./CreateChart.js";
//función encargado de renderizar los datos guardados de la base de datos
export function RenderData(){
    const d=document,$dataBase=d.querySelector(".dataBase"),$userMenu=d.querySelector(".userMenu"),
    $dataBaseTitle= d.createElement("div"),$dataBaseContent= d.createElement("div"),$error= d.createElement("div");
    $dataBaseContent.classList.add("dataBaseContent");
    $dataBaseTitle.classList.add("dataBaseTitle");
    $error.classList.add("dataBaseError");
    $error.innerHTML=`No hay datos guardados en mongoDB`;
    $dataBaseTitle.innerHTML=`<u><b>Base de Datos</b></u>`;
    $dataBase.appendChild($dataBaseTitle);
    $dataBase.appendChild($error);
    $dataBase.appendChild($dataBaseContent);
    //esperar un evento click del ratón
    $userMenu.addEventListener("click", e => {
        //si se pulsa el botón de base de datos
        if (e.target.matches(".databaseLink")) {
            console.log("estoy en database");
            //enviar petición por Ajax al lado del servidor para obtener los datos de la base de datos 
            getAjax("/database",function(data){
                let html=``;
                if(!data.length){
                    $error.style.display="block";
                }else{
                    $error.style.display="none";
                }
                //una vez obtenido los datos se renderizan en la aplicación 
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
                    //crear las gráficas
                    let $chart=CreateChart(`${el._id}`,`${el.sensor}`,el.data_x,el.data_y);
                   
                }
                )
            },function(error){
                //mostrar error de petición
                console.log(error);
            });
        }
    });

}