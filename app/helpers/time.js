//función encargado de obtener la hora actual
export function time(){
    //la función addZero añade un zero delante si el valor de hora, minuto o segundo sea menor que 10 (0X)
    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }

    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let time = h + ":" + m + ":" + s;
    return time;
}