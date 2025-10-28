const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const personTypeDefs = require('./schemas/personSchema');
const personResolvers = require('./resolvers/personResolver');

// Función para crear el contexto (autenticación)
const context = ({ req }) => {
  // Obtener token del header o cookies
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (cookieToken) {
    token = cookieToken;
  }

  // Si hay token, verificarlo
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        userId: decoded.id,
        userRole: decoded.role
      };
    } catch (error) {
      console.error('Error verificando token:', error.message);
      return {};
    }
  }

  return {};
};

// Crear servidor Apollo
const createApolloServer = () => {
  return new ApolloServer({
    typeDefs: [personTypeDefs],
    resolvers: [personResolvers],
    context,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
      };
    }
  });
};

module.exports = createApolloServer;