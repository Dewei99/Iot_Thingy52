export function Battery(device) {
    const $battery = document.createElement("div"), $icon=document.createElement("i"),$span=document.createElement("span"), $title=document.querySelector(".title");
    let estado=false, data;
    $battery.classList.add("battery");
    $icon.classList.add("fa");
    $icon.classList.add("fa-battery");
    $span.innerHTML=`?`;
    $battery.appendChild($icon);
    $battery.appendChild($span);
    
    console.log("estoy en bateria");


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
        if((data>=90)&&(data<=100)){
            $icon.classList.add("fa-battery-4");
            $icon.classList.add("green-color");
        }
        if((data>=60)&&(data<90)){
            $icon.classList.add("fa-battery-3");
            $icon.classList.add("green-color");
        }
        if((data>=40)&&(data<60)){
            $icon.classList.add("fa-battery-2");
            $icon.classList.add("teal-color");
        }
        if((data>=10)&&(data<40)){
            $icon.classList.add("fa-battery-1");
            $icon.classList.add("yellow-color");
        }
        if((data>=0)&&(data<10)){
            $icon.classList.add("fa-battery-0");
            $icon.classList.add("red-color");
        }

    }

    //funcion para actualizar los datos renderizados
    async function logData(data) {

        //console.log("hola estoy en el eventlistenner");
        //espera de obtención de datos
        data=await device.battery.read();
        //console.log(`data battery ${data}`);
        //console.log(data.status);
        $span.innerHTML = `${data.status}%`;
        render(data.status);
    }

    async function leerData(){
        data=await device.battery.read();
        console.log(`data battery ${data}`);
        console.log(data.status);
        $span.innerHTML = `${data.status}%`;
        render(data.status);
        await device.addEventListener("battery", logData);
    }

    async function start_Bateria(device) {
        try{

            setTimeout(async function(){
                let bool=await device.battery.start();
                console.log(bool);

                leerData();
                if(data===false){
                    setTimeout(async function(){
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

    async function stop_Bateria(device) {

        try{
            let bool=await device.battery.stop();

            console.log("estoy en la función stop");
            console.log(bool);

        } catch(error){
            console.error(error);

        }
    }

    //llama a la función cada segundo, dependiendo si el valor de device.connected es true(conectado) o false(desconectado) se ejecuta start_Bateria o stop_Bateria
    setInterval(function(){

        if((device.connected)&&(estado===false)){
            start_Bateria(device);
            estado=true;
            //$title.innerHTML='Thingy:52 - Conectado';
            console.log(device.connected);
        }
        if((device.connected===false)&&(estado===true)){
            stop_Bateria(device);
            //$title.innerHTML='Thingy:52 - Desconectado';
            estado=false;
        }
    }, 1000);

    return $battery;
}