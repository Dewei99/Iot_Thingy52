import { App } from "./App.js";
import { router } from "./helpers/router.js";

const d = document;

window.addEventListener("popstate", router);
//Una vez cargado el documento HTML y los scripts, se ejecuta App.
d.addEventListener("DOMContentLoaded",App);

/*let template = () =>{
    let todo = 1;
}

template.data = { int: 1}

console.log(template);
console.log(template.data);*/

