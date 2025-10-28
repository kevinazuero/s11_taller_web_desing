const { gql } = require('apollo-server-express');

const personTypeDefs = gql`
  type Person {
    id: Int!
    dni: Int!
    name: String!
    lastname: String!
    birthday: String!
    ciudad: String!
    genero: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePersonInput {
    dni: Int!
    name: String!
    lastname: String!
    birthday: String!
    ciudad: String!
    genero: String!
  }

  input UpdatePersonInput {
    dni: Int
    name: String
    lastname: String
    birthday: String
    ciudad: String
    genero: String
  }

  type Query {
    # Obtener todas las personas
    getAllPersons: [Person!]!
    
    # Obtener persona por ID
    getPersonById(id: Int!): Person
    
    # Obtener persona por DNI
    getPersonByDni(dni: Int!): Person
  }

  type Mutation {
    # Crear nueva persona
    createPerson(input: CreatePersonInput!): Person!
    
    # Actualizar persona existente
    updatePerson(id: Int!, input: UpdatePersonInput!): Person!
    
    # Eliminar persona
    deletePerson(id: Int!): String!
  }
`;

module.exports = personTypeDefs;