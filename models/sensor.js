
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//indicaremos cómo se va a lucir los datos dentro de la base de datos MongoDB
//Estructura de los datos
const sensorSchema = new Schema({
  nombre:  String,
  descripcion: String
}, { collection: 'datos', versionKey: false });

// Crear el modelo
const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;