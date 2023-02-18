export function CreateChart(contenedor,tipo,data_x=[],data_y=[]){

let $grafica;


//window.onload= function(){

const crear=()=>{
return new Chart(document.getElementById(contenedor),{
    type: 'line',
    data: {
        labels: data_x,//[],
        datasets: [{ 
            data: data_y,//[],
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
//console.log(`mostrar data: ${$grafica.data.datasets.data}`);
return $grafica;
}