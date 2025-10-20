const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  sqlId: { type: Number, required: true }, // referencia al registro en PostgreSQL
  dni: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  birthday: { type: Date, required: true },
  ciudad: { type: String, required: true },
  genero: { type: String, required: true }
});

module.exports = mongoose.model('PersonMongo', PersonSchema);
