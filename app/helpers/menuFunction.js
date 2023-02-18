export function menuFunction(panelBtn, panel){
    const d=document;
    
    d.addEventListener("click", e=>{
        if(e.target.matches(panelBtn)||e.target.matches(`${panelBtn} *`)||e.target.matches('.sensorsLink')){
            d.querySelector(panel).classList.toggle("is-active");
            console.log("menu");
        }
    
    });

}