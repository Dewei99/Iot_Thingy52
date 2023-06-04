const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Schema es la estructura que indica cual es la forma en la que están estructurados los documentos que se almacenan en MongoDB
//Se define la estructura de datos del sensor que tiene el modo remoto activado
const realTimeDataSchema = new Schema({
  sensor:  String,
  date: String,
  data_x: Array,
  data_y: Array,
  user_id: Number
}, { collection: 'realTimeData', versionKey: false });

// Crear el modelo
const RealTimeData = mongoose.model('RealTimeData', realTimeDataSchema/*,'sensores'*/);

module.exports = RealTimeData;