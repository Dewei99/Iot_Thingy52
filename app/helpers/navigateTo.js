import { router } from "./router.js";

//esta función evita que se refresque la página al cambiar la url o al navegar el historial del navegador
export function navigateTo(url){
    history.pushState(null, null, url);
    router();
}