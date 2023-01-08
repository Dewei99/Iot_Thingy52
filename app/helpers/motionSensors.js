import { fetchWavFile } from "./fetchWavFile.js";
import { playAudio } from "./playAudio.js";

export async function motionSensors(device,wavFile){
    try{
        const d=document,$screen=d.querySelector(".alarm");
        let arrayFile;

        arrayFile = await fetchWavFile(wavFile);
        //console.log(wavBlob);

        /*const reader = new FileReader();

        reader.readAsArrayBuffer(wavBlob);
        
        reader.onload = (e) => {
          let file = reader.result;
          console.log(file);
          arrayFile = new Uint8Array(file);
          //console.log(e.target.result);

        };*/
        //console.log(`audioState: ${audioState}`);
        console.log(arrayFile);
        console.log(arrayFile.length);
        const declinationAngle=0.00319977;
        let lastheadingDegrees=0,headingDegrees=0,diferencia=0;

        let bool=true,audioState;
        localStorage.setItem('audioState', 'off');
        localStorage.setItem('alarm', 'on');
        //audioState=true;
        //await playAudio(device,arrayFile);
        async function logRawData(data) {
            //console.log(data);
            //console.log(data.detail.gyroscope);
            audioState=localStorage.getItem('audioState');
            console.log(audioState);
            if(data.detail.gyroscope.x>1.2||data.detail.gyroscope.y>1.2||data.detail.gyroscope.z>1.2){
                //almacenar datos en localstorage del navegador
                //localStorage.setItem('alarm', 'on');
                if(audioState=='off'){
                    console.log(`fuera de if, bool:${bool}`);
                    //if(bool===true){
                    bool=false;
                    localStorage.setItem('alarm', 'on');
                    //console.log(audioState);
                    //localStorage.setItem('audioState', 'on');
                    console.log(`ejecuto audio y bool:${bool}`);
                    await playAudio(device,arrayFile);
                    $screen.classList.add("is-active");
                //}
                }
                    /*console.log(`bool: ${bool}`);
                    console.log(bool);*/
                //$screen.classList.add("is-active");
            }
            /*
            //obtener el grado del compas magnético o brújula
            let heading= Math.atan2(data.detail.compass.y, data.detail.compass.x);
            //depende de lugar hay que añadir el ángulo de declinación, que es 'error' del campo magnetico del lugar
            //obtenido en https://www.magnetic-declination.com/
            //const declinationAngle=0.00319977;
            heading += declinationAngle;
            //await playAudio(device,wav,audioState);
            // Corregir cuando el signo es negativo.
            if(heading < 0){
                heading += 2*Math.PI;
            }
            // Verifica el ajuste debido a la adición de la declinación.
            if(heading > 2*Math.PI){
                heading -= 2*Math.PI;
            }
            // Convertir radianes a grados para facilitar la lectura.
            lastheadingDegrees=headingDegrees;
            headingDegrees = heading * 180/Math.PI; 
            console.log(`${headingDegrees} º`);
            diferencia=headingDegrees-lastheadingDegrees;
            console.log(`diferencia ${diferencia}`);
            */
            /*setTimeout(async function(){
                await playAudio(device,wav,audioState);
            },3000);*/
            //bool= await playAudio(device,wav,audioState);
            /*if((headingDegrees-lastheadingDegrees)>=4){
                $screen.classList.add("is-active");*/
                /*if(bool==true){
                    bool=false;
                    bool=await playAudio(device,wav,audioState);
                } */   
            //}
        }

    /*function logRotationData(data) {
        console.log(data);
    }*/

    
        await device.rawdata.start();
        let servicio=await device.addEventListener("rawdata", logRawData);

        /*setInterval(function(){

            if(audioState='off'){
                start_Bateria(device);
                estado=true;
                console.log(device.connected);
            }

        }, 100);*/

        /*let bool2=await device.rotationmatrixorientation.start();
        let servicio2=await device.addEventListener("rotationmatrixorientation", logRotationData);*/

        //$boton.classList.add("is-active");
        console.log("estoy en la función start");
        console.log(bool);
        console.log(`solicitud de servicio: ${servicio}`);
    
    } catch(error){
        console.error(error);
        //console.log("no conectado");
    }
}