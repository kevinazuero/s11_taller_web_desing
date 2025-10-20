const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/dbPostgres');
const connectMongo = require('./config/dbMongo');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const Person = require('./routes/person');

const app = express();
app.use(helmet());
app.use(express.json()); //vas a interpretar las peticiones en json
app.use(cookieParser()); // para leer cookies enviadas por le cliente
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // aceptto peticiones de este front

app.use('/api/auth', authRoutes); // rutas de auth
app.use('/api/tasks', taskRoutes);
app.use('/api/persons', Person);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // en dev: crea tablas si no existen
    console.log('Postgres conectado');
    await connectMongo();
    app.listen(PORT, () => console.log('Server running on', PORT));
  } catch (err) {
    console.error('Error iniciando servidor', err);
  }
}

start();