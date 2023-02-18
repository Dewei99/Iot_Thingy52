export function postAjax(url='',data,callback,cbError){
    const $error=document.querySelector(".error");
    
    fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:data
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          callback(data);
        })
        .catch(function (error) {
            cbError(error);
        });



}