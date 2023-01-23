export async function router(){
    const d=document,
    $sensores=d.querySelector(".sensores"),
    $loginIn=d.querySelector(".loginIn"),
    $dataBase=d.querySelector(".dataBase"),
    $panel_btn=d.querySelector(".panel-btn");
    const routes = [
        { path: "/", view: /*`/`*/ ()=>{
            $sensores.style.display="block";
            $panel_btn.style.visibility="visible";
            $dataBase.style.display="none";
            $loginIn.style.display="none";
            console.log("estoy en /");
            console.log($loginIn.style.display);
        }},
        { path: "/login", view:/*`/login`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="none";
            $loginIn.style.display="flex";
            console.log("estoy en /login");
            console.log($loginIn.style.display);
        }},
        //{ path: "/posts/:id", view: PostView },
        { path: "/database", view:/*`/database`*/ ()=>{
            $sensores.style.display="none";
            $panel_btn.style.visibility="hidden";
            $dataBase.style.display="block";
            $loginIn.style.display="none";
            console.log("estoy en /database");
            console.log($loginIn.style.display);
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