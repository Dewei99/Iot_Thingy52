import { time } from "./time.js";
//función que retorna la fecha actual
export function date(){
    //la función addZero añade un zero delante si el valor de hora, minuto o segundo sea menor que 10 (0X)
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }

    const d = new Date();
    let day = addZero(d.getDate());
    let m = addZero(d.getMonth()+1);
    let y = addZero(d.getFullYear());
    let date = day + "/" + m + "/" + y+" -- "+ time();
    return date;
}