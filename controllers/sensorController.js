const Sensor = require('../models/sensor.js');
//Controlador utilizado para crear y eliminar datos
//crear
module.exports.crear = (req, res)=>{
    const sensor = new Sensor({
        sensor: req.body.sensor,
        date: req.body.date,
        data_x:req.body.data_x,
        data_y: req.body.data_y,
        user_id: req.user.id
    })
    sensor.save(function(error,sensor){
        if(error){
            //enviar mensaje de error al lado de cliente
            return res.status(500).json({
                message: 'Error al guardar datos',
                status:501
            })
        }else{
            //enviar mensaje al lado de cliente
            return res.json({ message: 'guardado correctamente' });
        }
    })
}
//borrar
module.exports.borrar = (req, res)=>{
    const id = req.params.id;
    Sensor.findByIdAndRemove(id, (error, alumno)=>{
        if(error){
            //enviar mensaje de error al lado de cliente
            return res.status(500).json({
                message: 'Error al eliminar datos',
                status:501
            })
        }else{
            //enviar datos al lado de cliente
            return res.json({success:true});
        }
    })
}
