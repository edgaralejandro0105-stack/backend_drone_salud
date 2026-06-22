const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const AppError = require('../utils/AppError');

const verificarToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No autorizado. Token no proporcionado', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id_usuario);

    if (!usuario) {
      return next(new AppError('El usuario ya no existe', 401));
    }

    if (usuario.estado_cuenta !== 'Activo') {
      return next(new AppError('Cuenta suspendida', 401));
    }

    req.user = usuario;
    next();
  } catch (error) {
    return next(new AppError('Token invalido', 401));
  }
};

const requiereRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.tipo_usuario)) {
      return next(new AppError('No tienes permisos para esta accion', 403));
    }
    next();
  };
};

module.exports = { verificarToken, requiereRoles };