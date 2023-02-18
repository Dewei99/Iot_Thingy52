const Sensor = require('../models/sensor.js');
//crear
module.exports.crear = (req, res)=>{
    //console.log(req.body)
    //console.log(req);
    const sensor = new Sensor({
        sensor: req.body.sensor,
        date: req.body.date,
        data_x:req.body.data_x,
        data_y: req.body.data_y
    })
    sensor.save(function(error,sensor){
        if(error){
            return res.status(500).json({
                message: 'Error al guardar datos',
                status:501
            })
        }else{
            res.json({ message: 'guardado correctamente' });
        }
    })
}
//borrar
module.exports.borrar = (req, res)=>{
    const id = req.params.id;
    Sensor.findByIdAndRemove(id, (error, alumno)=>{
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
