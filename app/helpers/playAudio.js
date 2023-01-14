import { ledController } from "./ledController.js";

export async function playAudio(thingy, wav8Array) {
    try {
      let speakerStatusReady = true;
      //console.log(wav8Array);
      await thingy.mtu.write(273);
      const myLogger = data => {
        const speakerStatus = data.detail.status;

        switch(speakerStatus) {
          case 0:
            //Finished
            speakerStatusReady = true;
            break;
          case 1: 
            // Buffer warning
            speakerStatusReady = false;
            break;
          case 16:
            //Packet disregarded
            speakerStatusReady = false;
            break;
          default:
            speakerStatusReady = true;
        }
      }
      thingy.addEventListener("speakerstatus", myLogger);

      let alarm,audioState;
      let index = 0;  
      let t0 = 0;
      let t1 = 0;
      let packetSize = 28;
      //let packetSize = 273;
      //let packetSize = 20;
      let packets = 0;
      let timer;
      let retries = 0;
      //let speakerStatusReady = true;
      function writeSoundPCMBatch(resolve, reject){
        alarm=localStorage.getItem('alarm');
        localStorage.setItem('audioState', 'on');
        /*audioState=localStorage.getItem('audioState');
        console.log(audioState);*/
        console.log(alarm);
        if(alarm=='on'){
        
        // Can write max 273 Bytes (MTU) at a time to the characteristic.
        // Writing with maximum data payload might result in Thingy speaker buffer filling up and packets will be dropped.
        // Sending 160 Byte batches has proved to be reliable.

          if(speakerStatusReady == false){    
        // Do a sanity check in case notifications have stopped whilst whe are retrying or we might en up in an endless loop of retries.
        // If there are 10 retries in a row it probably means notifications have stopped.
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
            // Delay execution by 10ms if Thingy audio buffer is almost full
            timer = setTimeout(function(){writeSoundPCMBatch(resolve, reject);}, 10); 
          }
      
          // write 160 Byte chunks of 8-bit audio data to Thingy
          else{  
              if(index + packetSize < wav8Array.length) {
                thingy.speakerdata.write({mode: 2, data: wav8Array.slice(index, index + packetSize)})
                .then(() => {
                  index += packetSize;
                  packets++;
                  // There is possibly a bug in Chrome that leads to the notification callback not firing. Happens irregularly.
                  // Restart notifications every 20 packets to make sure notifications are running.
                  // This does not add an audible delay to the aduio transmission.
                  if(packets % 20 == 0){
                    thingy.speakerstatus.start();
                                 
                  }
                  // reset retries on successful write
                  retries = 0;
                  // Repeat
                  writeSoundPCMBatch(resolve, reject);              
                })
                .catch(error => console.log(error));
              }
              else{
               // Send the last bytes
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
