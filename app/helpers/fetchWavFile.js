//función encargado de buscar el audio y guardarlo en un array de 8 bits sin signo
export async function fetchWavFile( ruta){
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

    })
}
