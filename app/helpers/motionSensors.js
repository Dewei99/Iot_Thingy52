import { fetchWavFile } from "./fetchWavFile.js";
import { ledController } from "./ledController.js";
import { playAudio } from "./playAudio.js";
import { postAjax } from "./postAjax.js";
//función encargado de activar el sensor de movimiento y la alarma
export async function motionSensors(device,wavFile){
    try{
        const d=document,$screen=d.querySelector(".alarm"),$panelAlarm=d.querySelector(".panelAlarm");
        let arrayFile, ifttt=true;

        arrayFile = await fetchWavFile(wavFile);

        console.log(arrayFile);
        console.log(arrayFile.length);
        const declinationAngle=0.00319977;
        let lastheadingDegrees=0,headingDegrees=0,diferencia=0;

        let bool=true,audioState;
        localStorage.setItem('audioState', 'off');
        //obtener valores del sensor de movimiento (giroscopio)
        async function logRawData(data) {

            audioState=localStorage.getItem('audioState');
            console.log(audioState);
            //se activa la alarma al superar los siguientes valores (velocidad angular)
            if(data.detail.gyroscope.x>1.2||data.detail.gyroscope.y>1.2||data.detail.gyroscope.z>1.2){

                if(audioState=='off'){
                    console.log(`fuera de if, bool:${bool}`);
                    //enviar un correo avisando que la alarma se ha activado
                    if(ifttt===true){
                        ifttt=false;
                        let objeto={event: "alarma",
                        alert:"null",
                        value:"null"    
                    };
                    //envío de petición al lado del servidor
                        postAjax("/ifttt",
                            JSON.stringify(objeto),
                            function(data){
                                console.log(data.message);
                            },  function(error){
                                console.log(error);
                            }
                        );
                        //se envía correo cada 1 min
                        setTimeout(async function(){
                           ifttt=true;
                        },60000);
                    }

                    bool=false;
                    localStorage.setItem('alarm', 'on');
                    console.log(`ejecuto audio y bool:${bool}`);
                    await playAudio(device,arrayFile);
                    await ledController(device);
                    $panelAlarm.classList.add("is-active");
                    $screen.classList.add("is-active");

                }

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

    
        await device.rawdata.start();
        //espera de evento, que es recibir datos del dispositivo
        let servicio=await device.addEventListener("rawdata", logRawData);


        console.log("estoy en la función start");
        console.log(bool);
        console.log(`solicitud de servicio: ${servicio}`);
    
    } catch(error){
        console.error(error);

    }
}