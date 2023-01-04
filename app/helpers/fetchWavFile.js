export function buscarWavFile( ruta){
    fetch(ruta)
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

      reader.onload = e => {
        var file = reader.result;
        console.log(file);
        const arrayFile = new Uint8Array(file);
        //console.log(e.target.result);
        console.log(arrayFile);
        return arrayFile;
      };
      //reader.readAsDataURL(myBlob);
    })
    .catch(error => {
      console.error(
        'Ha habido un problema con su operación de búsqueda:',
        error
      );
    });
}

// /Nordic-Thingy52-Thingyjs-master/examples/pcm0808m.wav