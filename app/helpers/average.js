//calcula la media
export function average(array_y){
    let total=0,count=0;
    array_y.forEach(function(item, index) {
        total += item;
        count++;
    });

    console.log(total / count);
    return (total / count);;
}