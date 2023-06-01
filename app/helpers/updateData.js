import { time } from "./time.js";
//función encargado de actualizar los datos de la gráfica
export function updateData(chart, data){
    let t=time();
    chart.data.datasets.forEach((dataset) => {
        if(dataset.data.length===15){
            dataset.data=dataset.data.slice(1);
            chart.data.labels=chart.data.labels.slice(1);
        }
        dataset.data.push(data);
    });
    chart.data.labels.push(t);
    chart.update();


}