import { ledController } from "./ledController.js";
//se encarga de enviar el audio de alarma al dispositivo
export async function playAudio(thingy, wav8Array) {
    try {
      let speakerStatusReady = true;
      console.log(wav8Array);
      await thingy.mtu.write(273);
      const myLogger = data => {
        const speakerStatus = data.detail.status;

        switch(speakerStatus) {
          case 0:
            //Terminado
            speakerStatusReady = true;
            break;
          case 1: 
            //Advertencia de búfer
            speakerStatusReady = false;
            break;
          case 16:
            //Paquete ignorado
            speakerStatusReady = false;
            break;
          default:
            speakerStatusReady = true;
        }
      }
      //obtener el estado del altavoz del dispositivo thingy 52
      thingy.addEventListener("speakerstatus", myLogger);

      let alarm,audioState;
      let index = 0;  
      let t0 = 0;
      let t1 = 0;
      let packetSize = 28;//envío de paquetes de audio de 28 bytes
      //let packetSize = 273;
      //let packetSize = 20;
      let packets = 0;
      let timer;
      let retries = 0;
      //let speakerStatusReady = true;
      function writeSoundPCMBatch(resolve, reject){
        //obtener el estado de alarma de la aplicación
        alarm=localStorage.getItem('alarm');
        localStorage.setItem('audioState', 'on');
        /*audioState=localStorage.getItem('audioState');
        console.log(audioState);*/
        console.log(alarm);
        //si el estado de alarma está activado se envía el audio de alarma al dispositivo thingy 52
        if(alarm=='on'){
        
        // Puede escribir un máximo de 273 bytes (MTU) a la vez en la característica.
        // Escribir con la carga de datos máxima puede provocar que el búfer de los altavoces Thingy se llene y los paquetes se descarten
        // El envío de paquetes de 28 bytes ha demostrado ser fiable.

          if(speakerStatusReady == false){    
        // Realice una verificación en caso de que las notificaciones del estado del altavoz se hayan detenido mientras se están reintentando o podríamos terminar en un ciclo interminable de reintentos.
        // Si hay 10 reintentos seguidos, probablemente signifique que las notificaciones se han detenido.
        //console.log('Retries = ' + retries);
            if((retries > 0) && (retries % 10) == 0){
              thingy.speakerstatus.start()
              .then(function(){
               retries = 0;
             })
              .catch(function(error){
                console.log(error);
              });
            }
            else{
              retries++;
            }
            //Retrasa la ejecución en 10 ms si el búfer de audio de Thingy está casi lleno
            timer = setTimeout(function(){writeSoundPCMBatch(resolve, reject);}, 10); 
          }
      
          //escribir paquetes de 23 bytes de datos de audio de 8 bits en Thingy
          else{  
              if(index + packetSize < wav8Array.length) {
                thingy.speakerdata.write({mode: 2, data: wav8Array.slice(index, index + packetSize)})
                .then(() => {
                  index += packetSize;
                  packets++;
                  // Es posible que haya un error en Chrome que hace que la devolución de llamada de notificación no se active. Ocurre de forma irregular.
                  // Reinicie las notificaciones cada 20 paquetes para asegurarse de que se estén ejecutando.
                  // Esto no agrega un retraso audible a la transmisión de audio.
                  if(packets % 20 == 0){
                    thingy.speakerstatus.start();
                                 
                  }
                  //restablecer reintentos en escritura exitosa
                  retries = 0;
                  // Repetir
                  writeSoundPCMBatch(resolve, reject);              
                })
                .catch(error => console.log(error));
              }
              else{
               //Enviar los últimos bytes
                if(index < wav8Array.length){
                 thingy.speakerdata.write({mode: 2, data: wav8Array.slice(index, wav8Array.length - 1)})
                  .then(() => {
                   localStorage.setItem('audioState', 'off');      
                   console.log(audioState);    
                   resolve;
                   ledController(thingy);
                   //return true;
                   
                  })
                  .catch(error => console.log(error));
                }
                else {
                  localStorage.setItem('audioState', 'off');
                  console.log(audioState);
                  ledController(thingy);
                  resolve;
   
                }
              }
            }
       }else{
        localStorage.setItem('audioState', 'off');
        console.log(audioState);
        ledController(thingy);
        //resolve(true);
        return false;
  
       }

      }  
      await thingy.soundconfiguration.write({speakerMode: 2, microphoneMode: 1});
      await thingy.speakerstatus.start();
      //localStorage.setItem('audioState', 'on');
      //localStorage.setItem('alarm', 'on');   
      writeSoundPCMBatch()         
      } catch (error) {
        console.error(error);
      }
    }
