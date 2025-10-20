const Person = require('../models/Person'); // PostgreSQL
const PersonMongo = require('../mongoModels/Person'); // MongoDB

// Crear persona
exports.createPerson = async (req, res) => {
  console.log(req.body);
  const t = await Person.sequelize.transaction();
  try {
    const { dni, name, lastname, birthday, ciudad, genero } = req.body;

    // 1️⃣ Crear en PostgreSQL
    const newPerson = await Person.create(
      { dni, name, lastname, birthday, ciudad, genero },
      { transaction: t }
    );

    // 2️⃣ Crear en MongoDB (referenciando el ID de SQL)

    await PersonMongo.create({
      sqlId: newPerson.id,
      dni,
      name,
      lastname,
      birthday,
      ciudad,
      genero
    });

    await t.commit();
    res.status(201).json(newPerson);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al crear persona' });
  }
};

// Obtener todas las personas
exports.getPersons = async (req, res) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener personas' });
  }
};

// Actualizar persona
exports.updatePerson = async (req, res) => {
  const t = await Person.sequelize.transaction();
  try {
    const { dni, name, lastname, birthday, ciudad, genero } = req.body;
    const person = await Person.findByPk(req.params.id);

    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    // 1️⃣ Actualizar en PostgreSQL
    await person.update({ dni, name, lastname, birthday, ciudad, genero }, { transaction: t });

    // 2️⃣ Actualizar en MongoDB
    await PersonMongo.updateOne(
      { sqlId: req.params.id },
      { dni, name, lastname, birthday, ciudad, genero }
    );

    await t.commit();
    res.json(person);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar persona' });
  }
};

// Eliminar persona
exports.deletePerson = async (req, res) => {
  const t = await Person.sequelize.transaction();
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    // 1️⃣ Eliminar en PostgreSQL
    await person.destroy({ transaction: t });

    // 2️⃣ Eliminar en MongoDB
    await PersonMongo.deleteOne({ sqlId: req.params.id });

    await t.commit();
    res.json({ message: 'Persona eliminada' });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar persona' });
  }
};

exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
    res.json(person);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener persona' });
  }
};