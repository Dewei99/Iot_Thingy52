//petición por ajax para solicitar datos al servidor
export function getAjax(url='',callback,cbError){
    const $error=document.querySelector(".error");
    //utilizar api de fetch para la solicitud asíncrona
    fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",//formato json
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        //función callback
        .then(function (data) {
          localStorage.setItem('error', 'off');
          callback(data);
        })
        //función error
        .catch(function (error) {
          cbError(error);
        });
}