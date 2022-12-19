export function funcionMenu(panelBtn, panel){
    const d=document;
    
    d.addEventListener("click", e=>{
        if(e.target.matches(panelBtn)||e.target.matches(`${panelBtn} *`)){
            d.querySelector(panel).classList.toggle("is-active");
            console.log("menu");
        }
    
    });

}