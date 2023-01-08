export async function fetchWavFile( ruta){
    /*return await fetch(ruta)
    .then(response => {
      if (!response.ok) {
        throw new Error('La respuesta de la red no fue correcta');
      }
      console.log(response);
      //devuelve la respuesta como objeto Blob (datos binarios tipados)
      return response.blob();
    })
    .then(myBlob => {
      console.log(myBlob);

      //objeto que lee ficheros
      const reader = new FileReader();

      reader.readAsArrayBuffer(myBlob);
      
      reader.onload = (e) => {
        var file = reader.result;
        console.log(file);
        const arrayFile = new Uint8Array(file);
        //console.log(e.target.result);
        console.log(arrayFile);
        console.log(arrayFile.length);
        return arrayFile;

      };
      //reader.readAsDataURL(myBlob);
    })
    .catch(error => {
      console.error(
        'Ha habido un problema con su operación de búsqueda:',
        error
      );
    });*/
    let buscarWav=await fetch(ruta);
    let datos= await buscarWav.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.readAsArrayBuffer(datos);

      reader.onload = () => {
        let file = reader.result;
        const arrayFile = new Uint8Array(file);
        resolve(arrayFile);
      };
  
      reader.onerror = reject;
  
      //reader.readAsArrayBuffer(file);
    })
}

// /Nordic-Thingy52-Thingyjs-master/examples/pcm0808m.wav