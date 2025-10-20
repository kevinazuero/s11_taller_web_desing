const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error MongoDB', err);
  }
}

module.exports = connectMongo;