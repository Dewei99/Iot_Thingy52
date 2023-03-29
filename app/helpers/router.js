
import { getAjax } from "./getAjax.js";
import { userData } from "./userData.js";

export async function router(){
    const d=document,$error=d.querySelector(".error"),
    $sensores=d.querySelector(".sensores"),
    $loginPanel=d.querySelector(".loginPanel"),$panelAlarm=d.querySelector(".panelAlarm"),
    $dataBase=d.querySelector(".dataBase"),$userMenu=d.querySelector(".userMenu"),
    $panel_btn=d.querySelector(".panel-btn"),$username=d.querySelector(".username"),
    $logIn=d.querySelector(".logInButton"),$logOut=d.querySelector(".logOutButton"),
    $realTimeData=d.querySelector(".realTimeData");
    const routes = [
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
            console.log("estoy en /database");
            console.log($loginPanel.style.display);
            userData();
            localStorage.setItem('error', 'off');
            $error.classList.remove("is-active");
            //eliminar datos compartidos
            getAjax("/realTimeData",function(data){
                data.forEach(el => {
                    getAjax(`/deleteShare/${el._id}`,
                        function(data){
                            if(data.success==true){
                                console.log("dejar de compartir datos");
                            }
                    });            
                });
            });
            location.reload();
        } },
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
        { path: "/realTimeData", view:/*`/realTimeData`*/ ()=>{
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
    //console.log(match.route.view());
    //console.log(match.route.result);
    //document.querySelector(".main").innerHTML=match.route.view;
}