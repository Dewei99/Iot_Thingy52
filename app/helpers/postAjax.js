//envío de datos al lado del servidor
export function postAjax(url='',data,callback,cbError){
    const $error=document.querySelector(".error");
    //utilizar api de fetch para el envío de datos al lado del servidor de forma asíncrona
    fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",//formato json
        },
        body:data
      })
        .then(function (response) {
          return response.json();
        })
        //función callback
        .then(function (data) {
          callback(data);
        })
        //función error
        .catch(function (error) {
            cbError(error);
        });



}