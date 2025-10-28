const Person = require('../../models/Person');

const personResolvers = {
  Query: {
    getAllPersons: async (_, __, context) => {
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const persons = await Person.findAll({
          order: [['id', 'ASC']]
        });
        return persons;
      } catch (error) {
        console.error('Error en getAllPersons:', error);
        throw new Error('Error al obtener personas');
      }
    },

    // Obtener persona por ID
    getPersonById: async (_, { id }, context) => {
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const person = await Person.findByPk(id);
        if (!person) {
          throw new Error('Persona no encontrada');
        }
        return person;
      } catch (error) {
        console.error('Error en getPersonById:', error);
        throw error;
      }
    },

    // Obtener persona por DNI
    getPersonByDni: async (_, { dni }, context) => {
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const person = await Person.findOne({ where: { dni } });
        if (!person) {
          throw new Error('Persona no encontrada');
        }
        return person;
      } catch (error) {
        console.error('Error en getPersonByDni:', error);
        throw error;
      }
    }
  },

  Mutation: {
    createPerson: async (_, { input }, context) => {
      const t = await Person.sequelize.transaction();
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const { dni, name, lastname, birthday, ciudad, genero } = input;

        // Verificar si ya existe el DNI
        const existingPerson = await Person.findOne({ where: { dni } });
        if (existingPerson) {
          throw new Error('Ya existe una persona con ese DNI');
        }

        const newPerson = await Person.create(
          { dni, name, lastname, birthday, ciudad, genero },
          { transaction: t }
        );

        await t.commit();
        return newPerson;
      } catch (error) {
        await t.rollback();
        console.error('Error en createPerson:', error);
        throw error;
      }
    },

    updatePerson: async (_, { id, input }, context) => {
      const t = await Person.sequelize.transaction();
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const person = await Person.findByPk(id);
        if (!person) {
          throw new Error('Persona no encontrada');
        }

        // Si se intenta actualizar el DNI, verificar que no exista
        if (input.dni && input.dni !== person.dni) {
          const existingPerson = await Person.findOne({ where: { dni: input.dni } });
          if (existingPerson) {
            throw new Error('Ya existe una persona con ese DNI');
          }
        }

        await person.update(input, { transaction: t });
        await t.commit();

        return person;
      } catch (error) {
        await t.rollback();
        console.error('Error en updatePerson:', error);
        throw error;
      }
    },

    deletePerson: async (_, { id }, context) => {
      const t = await Person.sequelize.transaction();
      try {
        if (!context.userId) {
          throw new Error('No autenticado');
        }

        const person = await Person.findByPk(id);
        if (!person) {
          throw new Error('Persona no encontrada');
        }

        await person.destroy({ transaction: t });
        await t.commit();

        return `Persona con ID ${id} eliminada exitosamente`;
      } catch (error) {
        await t.rollback();
        console.error('Error en deletePerson:', error);
        throw error;
      }
    }
  }
};

module.exports = personResolvers;