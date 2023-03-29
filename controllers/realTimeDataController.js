const RealTimeData = require('../models/realTimeData.js');

//crear
module.exports.crearRTD = (req, res)=>{
    //console.log(req.body)
    //console.log(req);
    const realTimeData = new RealTimeData({
        sensor: req.body.sensor,
        date: req.body.date,
        data_x:req.body.data_x,
        data_y: req.body.data_y
    })
    realTimeData.save(function(error,sensor){
        if(error){
            return res.status(500).json({
                message: 'Error al compartir datos',
                status:501
            })
        }else{
            return res.json({ message: 'compartido correctamente' });
        }
    })
}

//Editar
module.exports.editarRTD = (req,res)=>{
    const _id = req.body.id;
    const sensor = req.body.sensor;
    const date =  req.body.date;
    const data_x = req.body.data_x;
    const data_y = req.body.data_y;
    RealTimeData.findByIdAndUpdate(_id,{
    sensor, date, data_x, data_y}, {new: true}, (error, sensor)=>{
        if(error){
            return res.status(500).json({
                message: 'Error actualización'
            })
        }else{
            return res.json({ message: 'editado correctamente' });
        }
    })
}
//buscar dato
module.exports.findOne =(req, res)=>{
    const id = req.params.id;
    console.log(req.params.id);
    /*RealTimeData.findById(id).lean().exec(function (err, results) {
        if (err) return console.error(err)
        try {
            console.log(results)
            res.json(results);            
        } catch (error) {
            console.log("errror getting results")
            console.log(error)
        } 
    })*/
    RealTimeData.findById(id,function (err, result) {
        if (err) return console.error(err)
        try {
            res.json(result);            
        } catch (error) {
            console.log("error getting results");
            console.log(error);
        } 
    });
}
//borrar
module.exports.borrarRTD =(req, res)=>{
    const id = req.params.id;
    RealTimeData.findByIdAndRemove(id, (error, sensor)=>{
        if(error){
            return res.status(500).json({
                message: 'Error al eliminar datos',
                status:501
            })
        }else{
            return res.json({success:true});
        }
    })
}
