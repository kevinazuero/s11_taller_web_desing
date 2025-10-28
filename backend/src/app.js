const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/dbPostgres');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const Person = require('./routes/person');
const createApolloServer = require('./graphql');

const app = express();

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// ✅ RUTAS REST (con express.json)
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/tasks', express.json(), taskRoutes);
app.use('/api/persons', express.json(), Person);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Postgres conectado');

    const apolloServer = createApolloServer();
    await apolloServer.start();

    // ✅ GraphQL (sin express.json, Apollo maneja el parsing)
    apolloServer.applyMiddleware({
      app,
      path: '/graphql',
      cors: {
        origin: 'http://localhost:5173',
        credentials: true
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error('Error iniciando servidor', err);
  }
}

start();