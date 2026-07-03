const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Usuario, OperadorVuelo } = require('../models');
const AppError = require('../utils/AppError');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const generarToken = (id_usuario) => {
  return jwt.sign({ id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const register = async (userData) => {
  const { password, ...rest } = userData;
  const existingEmail = await Usuario.findOne({ where: { email: rest.email } });
  if (existingEmail) {
    throw new AppError('El email ya esta registrado', 400);
  }
  if (rest.cedula) {
    const existingCedula = await Usuario.findOne({ where: { cedula: rest.cedula } });
    if (existingCedula) {
      throw new AppError('El numero de cedula ya esta registrado', 400);
    }
  }
  const usuario = await Usuario.create({
    ...rest,
    password_hash: hashPassword(password),
    estado_cuenta: 'Activo',
    fecha_registro: new Date()
  });
  const token = generarToken(usuario.id_usuario);
  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      telefono: usuario.telefono,
      cedula: usuario.cedula
    }
  };
};

const login = async (email, password) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario || usuario.password_hash !== hashPassword(password)) {
    throw new AppError('Credenciales invalidas', 401);
  }
  if (usuario.estado_cuenta !== 'Activo') {
    const messages = {
      Suspendido: 'Tu cuenta ha sido suspendida. Contacta a soporte.',
      Inactivo: 'Tu cuenta ha sido desactivada.'
    };
    throw new AppError(messages[usuario.estado_cuenta] || 'Cuenta no disponible.', 401);
  }
  await usuario.update({ ultimo_acceso: new Date() });
  const token = generarToken(usuario.id_usuario);
  const usuarioData = {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,
    telefono: usuario.telefono,
    cedula: usuario.cedula,
    foto_url: usuario.foto_url,
    id_farmacia: usuario.id_farmacia
  };
  if (usuario.tipo_usuario === 'operador' || usuario.tipo_usuario === 'admin') {
    const operador = await OperadorVuelo.findOne({ where: { id_usuario: usuario.id_usuario }, attributes: ['id_operador'] });
    if (operador) usuarioData.id_operador = operador.id_operador;
  }
  return {
    token,
    usuario: usuarioData
  };
};

const getProfile = async (id_usuario) => {
  const usuario = await Usuario.findByPk(id_usuario, {
    attributes: { exclude: ['password_hash'] }
  });
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  const data = usuario.toJSON();
  if (data.tipo_usuario === 'operador' || data.tipo_usuario === 'admin') {
    const operador = await OperadorVuelo.findOne({ where: { id_usuario }, attributes: ['id_operador'] });
    if (operador) data.id_operador = operador.id_operador;
  }
  return data;
};

const changePassword = async (id_usuario, currentPassword, newPassword) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  if (usuario.password_hash !== hashPassword(currentPassword)) {
    throw new AppError('La contraseña actual no es correcta', 400);
  }
  await usuario.update({ password_hash: hashPassword(newPassword) });
  return { message: 'Contraseña actualizada correctamente' };
};

const updateProfile = async (id_usuario, data) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  const allowedFields = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'foto_url'];
  const payload = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) payload[field] = data[field];
  }
  await usuario.update(payload);
  if (data.foto_url !== undefined && usuario.tipo_usuario === 'operador') {
    await OperadorVuelo.update({ foto_url: data.foto_url }, { where: { id_usuario } });
  }
  const updated = await Usuario.findByPk(id_usuario, {
    attributes: { exclude: ['password_hash'] }
  });
  return updated;
};

module.exports = { register, login, getProfile, changePassword, updateProfile };