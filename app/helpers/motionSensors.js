export async function motionSensors(device){

    const declinationAngle=0.00319977;
    function logRawData(data) {
        //console.log(data);

        //obtener el grado del compas magnético o brújula
        let heading= Math.atan2(data.detail.compass.y, data.detail.compass.x);
        //depende de lugar hay que añadir el ángulo de declinación, que es 'error' del campo magnetico del lugar
        //obtenido en https://www.magnetic-declination.com/
        //const declinationAngle=0.00319977;
        heading += declinationAngle;

          // Corregir cuando el signo es negativo.
        if(heading < 0){
            heading += 2*Math.PI;
        }
        // Verifica el ajuste debido a la adición de la declinación.
        if(heading > 2*Math.PI){
            heading -= 2*Math.PI;
        }
        // Convertir radianes a grados para facilitar la lectura.
        let headingDegrees = heading * 180/Math.PI; 
        console.log(`${headingDegrees} º`);

    }

    /*function logRotationData(data) {
        console.log(data);
    }*/

    try{
        let bool=await device.rawdata.start();
        let servicio=await device.addEventListener("rawdata", logRawData);

        /*let bool2=await device.rotationmatrixorientation.start();
        let servicio2=await device.addEventListener("rotationmatrixorientation", logRotationData);*/

        //$boton.classList.add("is-active");
        console.log("estoy en la función start");
        console.log(bool);
        console.log(`solicitud de servicio: ${servicio}`);
    
    } catch(error){
        console.error(error);
        console.log("no conectado");
    }
}