//función encargado de renderizar el icono de batería y mostrar el porcentaje de batería
export function Battery(device) {
    const $battery = document.createElement("div"), $icon=document.createElement("i"),$span=document.createElement("span"), $title=document.querySelector(".title");
    let estado=false, data, inicioInterval1,inicioInterval2;
    $battery.classList.add("battery");
    $icon.classList.add("fa");
    $icon.classList.add("fa-battery");
    $span.innerHTML=`?`;
    $battery.appendChild($icon);
    $battery.appendChild($span);
    
    console.log("estoy en bateria");

    //función renderizar icono batería
    function render(data){
        $icon.classList.remove("fa-battery");
        $icon.classList.remove("fa-battery-0");
        $icon.classList.remove("fa-battery-1");
        $icon.classList.remove("fa-battery-2");
        $icon.classList.remove("fa-battery-3");
        $icon.classList.remove("fa-battery-4");
        $icon.classList.remove("green-color");
        $icon.classList.remove("yellow-color");
        $icon.classList.remove("red-color");
        $icon.classList.remove("teal-color");
        //icono batería full
        if((data>=90)&&(data<=100)){
            $icon.classList.add("fa-battery-4");
            $icon.classList.add("green-color");
        }
        //icono batería casi full
        if((data>=60)&&(data<90)){
            $icon.classList.add("fa-battery-3");
            $icon.classList.add("green-color");
        }
        //icono batería medio
        if((data>=40)&&(data<60)){
            $icon.classList.add("fa-battery-2");
            $icon.classList.add("teal-color");
        }
        //icono batería menos de medio
        if((data>=10)&&(data<40)){
            $icon.classList.add("fa-battery-1");
            $icon.classList.add("yellow-color");
        }
        //icono batería vacía
        if((data>=0)&&(data<10)){
            $icon.classList.add("fa-battery-0");
            $icon.classList.add("red-color");
        }

    }

    //funcion para actualizar los datos renderizados
    async function logData(data) {

        //espera de obtención de datos
        data=await device.battery.read();
        //renderizar porcentaje de batería
        $span.innerHTML = `${data.status}%`;
        //función renderizar icono batería
        render(data.status);
    }

    //funcion inicio de renderizado de icono y porcentaje de batería
    async function leerData(){
        //renderizado inicial
        data=await device.battery.read();
        console.log(`data battery ${data}`);
        console.log(data.status);
        $span.innerHTML = `${data.status}%`;
        render(data.status);

        //espera de recibir datos, ejecuta la función logData cuando la app recibe datos
        await device.addEventListener("battery", logData);
    }

    //función de inicio de lectura de batería
    async function start_Bateria(device) {
        try{

            inicioInterval1=setTimeout(async function(){
                //inicio de lectura de batería
                let bool=await device.battery.start();
                console.log(bool);
                //inicio de renderizado de icono y porcentaje de batería
                leerData();
                //en caso de no recibir datos, esperar 3 seg para volver a intentar el inicio de lectura de batería
                if(data===false){
                    inicioInterval2=setTimeout(async function(){
                        let bool=await device.battery.start();
                        console.log(bool);
                        leerData();
                    },3000);
                }
            },5500);

            console.log("estoy en la función start bateria");
        
        } catch(error){
            console.error(error);
            console.log("no conectado");

        }
    }
    //función de parada de lectura de batería
    async function stop_Bateria(device) {

        try{
            //parada de lectura de batería
            let bool=await device.battery.stop();

            console.log("estoy en la función stop");
            console.log(bool);

        } catch(error){
            console.error(error);

        }
    }

    //llama a la función cada segundo, dependiendo si el valor de device.connected es true(conectado) o false(desconectado) se ejecuta start_Bateria o stop_Bateria
    setInterval(function(){

        if((device.connected===true)&&(estado===false)){
            start_Bateria(device);
            estado=true;
            console.log(device.connected);
        }
        if((device.connected===false)&&(estado===true)){
            stop_Bateria(device);
            estado=false;
        }
    }, 1000);

    return $battery;
}