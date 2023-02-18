import { time } from "./time.js";

export function updateData(chart, data){
    /*function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
    }

    const d = new Date();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    let s = addZero(d.getSeconds());
    let time = h + ":" + m + ":" + s;*/
    let t=time();
        //chart.data.labels.push(time);
    chart.data.datasets.forEach((dataset) => {
        //console.log(dataset.data.length);
        if(dataset.data.length===15){
            dataset.data=dataset.data.slice(1);
            chart.data.labels=chart.data.labels.slice(1);
            //console.log("hola 5");
        }
        dataset.data.push(data);
    });
    chart.data.labels.push(t);
    chart.update();


}