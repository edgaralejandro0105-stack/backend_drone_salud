const { MantenimientoDron, FlotaDron, Usuario } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  const dron = await FlotaDron.findByPk(data.id_dron);
  if (!dron) throw new AppError('Dron no encontrado', 404);

  const registro = await MantenimientoDron.create({
    id_dron: data.id_dron,
    id_usuario: data.id_usuario,
    tipo_servicio: data.tipo_servicio || 'Correctivo',
    descripcion_falla: data.descripcion_falla || '',
    estado: data.estado || 'Pendiente'
  });

  await dron.update({
    estado_operativo: 'Mantenimiento',
    motivo_mantenimiento: data.descripcion_falla || ''
  });

  return MantenimientoDron.findByPk(registro.id_mantenimiento, {
    include: [
      { association: 'dron', attributes: ['matricula', 'modelo', 'estado_operativo'] },
      { association: 'usuario', attributes: ['nombre', 'apellido'] }
    ]
  });
};

const getAll = async () => {
  return MantenimientoDron.findAll({
    include: [
      { association: 'dron', attributes: ['matricula', 'modelo', 'estado_operativo'] },
      { association: 'usuario', attributes: ['nombre', 'apellido'] }
    ],
    order: [['fecha_ingreso', 'DESC']]
  });
};

const getByDron = async (id_dron) => {
  return MantenimientoDron.findAll({
    where: { id_dron },
    include: [
      { association: 'usuario', attributes: ['nombre', 'apellido'] }
    ],
    order: [['fecha_ingreso', 'DESC']]
  });
};

const getById = async (id) => {
  const registro = await MantenimientoDron.findByPk(id, {
    include: [
      { association: 'dron', attributes: ['matricula', 'modelo', 'estado_operativo'] },
      { association: 'usuario', attributes: ['nombre', 'apellido'] }
    ]
  });
  if (!registro) throw new AppError('Registro de mantenimiento no encontrado', 404);
  return registro;
};

const update = async (id, data) => {
  const registro = await MantenimientoDron.findByPk(id);
  if (!registro) throw new AppError('Registro de mantenimiento no encontrado', 404);
  await registro.update(data);
  return registro;
};

const completar = async (id) => {
  const registro = await MantenimientoDron.findByPk(id);
  if (!registro) throw new AppError('Registro de mantenimiento no encontrado', 404);

  await registro.update({
    estado: 'Completado',
    fecha_completado: new Date()
  });

  const dron = await FlotaDron.findByPk(registro.id_dron);
  if (dron) {
    const enMantenimiento = await MantenimientoDron.findOne({
      where: { id_dron: dron.id_dron, estado: 'Pendiente' }
    });
    if (!enMantenimiento) {
      await dron.update({ estado_operativo: 'Activo', motivo_mantenimiento: '' });
    }
  }

  return registro;
};

const remove = async (id) => {
  const registro = await MantenimientoDron.findByPk(id);
  if (!registro) throw new AppError('Registro de mantenimiento no encontrado', 404);
  await registro.destroy();
  return { message: 'Registro de mantenimiento eliminado' };
};

module.exports = { create, getAll, getByDron, getById, update, completar, remove };
