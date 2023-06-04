const RealTimeData = require('../models/realTimeData.js');
//Controlador utilizado para crear, editar, buscar y eliminar datos
//crear
module.exports.crearRTD = (req, res)=>{
    const realTimeData = new RealTimeData({
        sensor: req.body.sensor,
        date: req.body.date,
        data_x:req.body.data_x,
        data_y: req.body.data_y,
        user_id: req.user.id
    })
    realTimeData.save(function(error,sensor){
        if(error){
            //enviar mensaje de error al lado de cliente
            return res.status(500).json({
                message: 'Error al compartir datos',
                status:501
            })
        }else{
            //enviar mensaje al lado de cliente
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
    const user_id= req.user.id;
    RealTimeData.findByIdAndUpdate(_id,{
    sensor, date, data_x, data_y,user_id}, {new: true}, (error, sensor)=>{
        if(error){
            //enviar mensaje de error al lado de cliente
            return res.status(500).json({
                message: 'Error actualización'
            })
        }else{
            //enviar mensaje al lado de cliente
            return res.json({ message: 'editado correctamente' });
        }
    })
}
//buscar datos
module.exports.findOne =(req, res)=>{
    const id = req.params.id;
    console.log(req.params.id);
    RealTimeData.findById(id,function (err, result) {
        if (err) return console.error(err)
        try {
            //enviar datos al lado de cliente
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
            //enviar mensaje de error al lado de cliente
            return res.status(500).json({
                message: 'Error al eliminar datos',
                status:501
            })
        }else{
            //enviar mensaje al lado de cliente
            return res.json({success:true});
        }
    })
}
