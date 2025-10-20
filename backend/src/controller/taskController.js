const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = await Task.create({ title, description, userId: req.userId });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    await task.update({ title, description, status });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    await task.destroy();
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};
