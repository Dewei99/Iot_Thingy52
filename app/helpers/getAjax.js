export function getAjax(url='',callback){
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
          localStorage.setItem('error', 'on');
          //$error.classList.add("is-active");
          console.error(`Fetch problem: ${err.message}`);
          console.log(error);

        });



}