import { App } from "./App.js";
import { router } from "./helpers/router.js";

const d = document;
//El evento popstate de la interfaz de Windows se desencadena cuando cambia la entrada del historial activo mientras el usuario navega por el historial de sesiones.
//window.addEventListener("popstate", router);
//Una vez cargado el documento HTML y los scripts, se ejecuta App.
d.addEventListener("DOMContentLoaded",App);


