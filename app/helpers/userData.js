import { getAjax } from "./getAjax.js";

export function userData(){
    //const d=document,$username=d.querySelector(".username");
    getAjax("/user",
    function(data){
        const d=document,$username=d.querySelector(".username");
        $username.innerHTML=`${data.name}`;
    }
    );
}