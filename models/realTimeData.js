const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//indicaremos cómo se va a lucir los datos dentro de la base de datos MongoDB
//Estructura de los datos
const realTimeDataSchema = new Schema({
  sensor:  String,
  date: String,
  data_x: Array,
  data_y: Array
}, { collection: 'realTimeData', versionKey: false });

// Crear el modelo
const RealTimeData = mongoose.model('RealTimeData', realTimeDataSchema/*,'sensores'*/);

module.exports = RealTimeData;