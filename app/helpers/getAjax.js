export function getAjax(url='',callback,cbError){
    const $error=document.querySelector(".error");
    
    fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then(function (data) {
          localStorage.setItem('error', 'off');
          //$error.classList.remove("is-active");
          callback(data);
        })
        .catch(function (error) {
          cbError(error);
          /*localStorage.setItem('error', 'on');
          //$error.classList.add("is-active");
          console.error(`Fetch problem: ${error.message}`);
          console.log(error);*/
        });
}