
import { getAjax } from "./getAjax.js";
import { userData } from "./userData.js";
//función encargado de modificar las vistas de la aplicación dependiendo de la ruta o url 
export async function router(){
    const d=document,$error=d.querySelector(".error"),
    $sensores=d.querySelector(".sensores"),
    $loginPanel=d.querySelector(".loginPanel"),$panelAlarm=d.querySelector(".panelAlarm"),
    $dataBase=d.querySelector(".dataBase"),$userMenu=d.querySelector(".userMenu"),
    $panel_btn=d.querySelector(".panel-btn"),$username=d.querySelector(".username"),
    $logIn=d.querySelector(".logInButton"),$logOut=d.querySelector(".logOutButton"),
    $realTimeData=d.querySelector(".realTimeData");
    const routes = [
        //vista inicio
        { path: "/", view: /*`/`*/ ()=>{
            $sensores.style.display="block";
            $panel_btn.style.visibility="visible";
            $dataBase.style.display="none";
            $realTimeData.style.display="none";
            $loginPanel.style.display="none";
            $username.style.display="block";
            $panelAlarm.style.display="block";
            $logIn.classList.remove("is-active");
            $logOut.classList.add("is-active");
            $userMenu.classList.add("is-active");
            console.log("estoy en /");
            console.log($loginPanel.style.display);
            userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
        }},
        //vista login
        { path: "/login", view:/*`/login`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="none";
            $realTimeData.style.display="none";
            $loginPanel.style.display="flex";
            $username.style.display="none";
            $panelAlarm.style.display="none";
            $logIn.classList.add("is-active");
            $logOut.classList.remove("is-active");
            $userMenu.classList.remove("is-active");
            console.log("estoy en /login");
            console.log($loginPanel.style.display);
        }},
        //{ path: "/posts/:id", view: PostView },
        //vista base de datos
        { path: "/database", view:/*`/database`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="block";
            $realTimeData.style.display="none";
            $loginPanel.style.display="none";
            $username.style.display="block";
            $panelAlarm.style.display="none";
            $logIn.classList.remove("is-active");
            $logOut.classList.add("is-active");
            $userMenu.classList.add("is-active");
            d.querySelector(".panelMenu").classList.remove("is-active");
            console.log("estoy en /database");
            console.log($loginPanel.style.display);
            userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
        } },
        //cerra sesión
        { path: "/signout", view:/*`/database`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="none";
            $realTimeData.style.display="none";
            $loginPanel.style.display="none";
            $username.style.display="none";
            $panelAlarm.style.display="none";
            $logIn.classList.add("is-active");
            $logOut.classList.remove("is-active");
            $userMenu.classList.remove("is-active");
            d.querySelector(".panelMenu").classList.remove("is-active");
            console.log("estoy en /database");
            console.log($loginPanel.style.display);
            userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
            //eliminar datos compartidos
            let conexion=localStorage.getItem('conexion');
            if(conexion=="on"){
                getAjax("/remote",function(data){
                    data.forEach(el => {
                        getAjax(`/deleteShare/${el._id}`,
                            function(data){
                                if(data.success==true){
                                    console.log("dejar de compartir datos");
                                }
                        },function(error){
                            console.log(error);
                        });
                        localStorage.setItem('error', 'off');            
                    });
                },function(error){
                    console.log(error);
                });
            }
            localStorage.setItem('error', 'off');
            location.reload();
        } },
        //vista sensores
        { path: "/sensors", view: /*`/`*/ ()=>{
            $sensores.style.display="block";
            $panel_btn.style.visibility="visible";
            $dataBase.style.display="none";
            $realTimeData.style.display="none";
            $loginPanel.style.display="none";
            $username.style.display="block";
            $panelAlarm.style.display="block";
            $logIn.classList.remove("is-active");
            $logOut.classList.add("is-active");
            $userMenu.classList.add("is-active");
            console.log("estoy en /");
            console.log($loginPanel.style.display);
            userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
        }},
        //vista modo remoto
        { path: "/remote", view:/*`/realTimeData`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="none";
            $realTimeData.style.display="block";
            $loginPanel.style.display="none";
            $username.style.display="block";
            $panelAlarm.style.display="none";
            $logIn.classList.remove("is-active");
            $logOut.classList.add("is-active");
            $userMenu.classList.add("is-active");
            d.querySelector(".panelMenu").classList.remove("is-active");
            console.log("estoy en /realTimeData");
            console.log($loginPanel.style.display);
            //userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
        } }
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname=== route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    match.route.view();
}