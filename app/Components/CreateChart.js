//Función encargado de renderizar la gráfica
export function CreateChart(contenedor,tipo,data_x=[],data_y=[]){

let $grafica;

const crear=()=>{
return new Chart(document.getElementById(contenedor),{
    //tipo de gráfica: línea
    type: 'line',
    //estructura de datos de la gráfica
    data: {
        //eje x
        labels: data_x,
        datasets: [{ 
            //eje y
            data: data_y,
            label: tipo,
            borderColor: "#3e95cd",
            fill: false
            }
        ]
    },                                                
    options: {
        title: {
          display: false,
          text: tipo
        },
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    // OR //
                    //beginAtZero: true   // minimum value will be 0.
                }
            }]
        }
    }
});

}
$grafica= crear();
console.log(`crear chart: ${$grafica}`);
return $grafica;
}