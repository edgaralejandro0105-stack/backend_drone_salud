const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.validatedBody);
  res.status(201).json(result);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.validatedBody;
  const result = await authService.login(email, password);
  res.json(result);
});

const getProfile = catchAsync(async (req, res) => {
  const usuario = await authService.getProfile(req.user.id_usuario);
  res.json(usuario);
});

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.id_usuario, currentPassword, newPassword);
  res.json(result);
});

const updateProfile = catchAsync(async (req, res) => {
  const usuario = await authService.updateProfile(req.user.id_usuario, req.body);
  res.json(usuario);
});

module.exports = { register, login, getProfile, changePassword, updateProfile };