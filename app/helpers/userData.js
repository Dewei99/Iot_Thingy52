import { getAjax } from "./getAjax.js";
//función encargado de obtener datos de usuario
export function userData(){
    //enviar petición al lado del servidor para obtener datos de usuario
    getAjax("/user",
    //función callback
    function(data){
        const d=document,$username=d.querySelector(".username");
        //renderizar nombre de usuario
        $username.innerHTML=`${data.name}`;
    },//función error
    function(error){
        console.log(error);
    }
    );
}