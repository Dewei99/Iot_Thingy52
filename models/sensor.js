
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Schema es la estructura que indica cual es la forma en la que están estructurados los documentos que se almacenan en MongoDB
//Se define la estructura de los datos
const sensorSchema = new Schema({
  sensor:  String,
  date: String,
  data_x: Array,
  data_y: Array,
  user_id: Number
}, { collection: 'datos', versionKey: false });

// Crear el modelo
const Sensor =mongoose.model('Sensor', sensorSchema/*,'sensores'*/);

module.exports = Sensor;