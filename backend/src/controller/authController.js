const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { email, password, bio } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email ya registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    // Crear perfil en Mongo
    await Profile.create({ userId: user.id, bio });

    return res.status(201).json({ message: 'Usuario creado', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });

    //se crea el token con jwt
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });

    // Ejemplo: enviar en cookie httpOnly (más seguro) y también en body (útil para demo)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: ['id','email','role'] });
    const profile = await Profile.findOne({ userId: req.userId });
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

module.exports = { register, login, me };
