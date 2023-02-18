export function readTime(array_x){

    // guardar primer item en una variable
    let f=array_x[0];
   
   // guardar ultimo item en una variable
   let l=array_x[array_x.length-1];

   let start =f.split(':');
   let end = l.split(':');
   let  t1 = new Date(),
        t2 = new Date();
    t1.setHours(end[0], end[1], end[2]);
    t2.setHours(start[0], start[1], start[2]);
    
    //Aquí hago la resta
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
    //let time= (end[0]-start[0])+":"+(end[1]-start[1]) +":"+(end[2]-start[2]);

    //El resultado
    let  diferencia =(t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? " " + t1.getMinutes() + (t1.getMinutes() > 1 ? " minutos" : " minuto") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? " segundos" : " segundo") : "");
 
    return diferencia;
}