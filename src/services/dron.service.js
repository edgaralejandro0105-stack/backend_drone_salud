const { FlotaDron, MantenimientoDron, Pedido } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

const create = async (data) => {
  return FlotaDron.create(data);
};

const getAll = async ({ search, page = 1, limit = 10 } = {}) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { modelo: { [Op.iLike]: `%${search}%` } },
      { fabricante: { [Op.iLike]: `%${search}%` } },
      { matricula: { [Op.iLike]: `%${search}%` } },
      { numero_serie: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await FlotaDron.findAndCountAll({
    where,
    order: [['id_dron', 'ASC']],
    limit,
    offset,
  });
  return { data: rows, total: count, page, totalPages: Math.ceil(count / limit) };
};

const getById = async (id) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  return dron;
};

const update = async (id, data, id_usuario = null) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);

  if (data.peso_maximo_despegue_kg === '' || data.peso_maximo_despegue_kg === undefined) delete data.peso_maximo_despegue_kg;
  if (data.horas_vuelo === '') data.horas_vuelo = 0;
  if (data.fecha_adquisicion === '') data.fecha_adquisicion = null;

  if (data.estado_operativo === 'Mantenimiento') {
    if (!data.motivo_mantenimiento || !data.motivo_mantenimiento.trim()) {
      throw new AppError('Debe especificar el motivo al poner el dron en mantenimiento', 400);
    }
    data.motivo_mantenimiento = data.motivo_mantenimiento.trim();
    await dron.update(data);

    await MantenimientoDron.create({
      id_dron: dron.id_dron,
      id_usuario,
      tipo_servicio: 'Correctivo',
      descripcion_falla: data.motivo_mantenimiento,
      estado: 'Pendiente'
    });

    return dron;
  }

  if (data.estado_operativo && data.estado_operativo !== 'Mantenimiento') {
    data.motivo_mantenimiento = '';

    if (data.estado_operativo === 'Activo') {
      await MantenimientoDron.update(
        { estado: 'Completado', fecha_completado: new Date() },
        {
          where: {
            id_dron: id,
            estado: ['Pendiente', 'En progreso']
          }
        }
      );
    }
  }

  await dron.update(data);
  return dron;
};

const remove = async (id) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  await dron.destroy();
  return { message: 'Dron eliminado correctamente' };
};

const getDisponibles = async () => {
  const activos = await FlotaDron.findAll({
    where: { estado_operativo: 'Activo' },
    order: [['id_dron', 'ASC']]
  });

  const enUso = await Pedido.findAll({
    attributes: ['id_dron'],
    where: {
      id_dron: { [Op.ne]: null },
      estado_pedido: { [Op.in]: ['Pendiente', 'Pagado', 'Preparado', 'En transito'] }
    }
  });

  const idsEnUso = new Set(enUso.map(p => p.id_dron));
  return activos.filter(d => !idsEnUso.has(d.id_dron));
};

const liberarDron = async (id_dron) => {
  const dron = await FlotaDron.findByPk(id_dron);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  await dron.update({ estado_operativo: 'Activo' });
  return dron;
};

const getHistorial = async (id) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);

  const mantenimientos = await MantenimientoDron.findAll({
    where: { id_dron: id },
    include: [
      { association: 'usuario', attributes: ['nombre', 'apellido'] }
    ],
    order: [['fecha_ingreso', 'DESC']]
  });

  const pedidos = await Pedido.findAll({
    where: { id_dron: id },
    include: [
      { association: 'farmacia', attributes: ['nombre_comercial'] },
      { association: 'detalles' }
    ],
    order: [['fecha_creacion', 'DESC']]
  });

  return {
    dron,
    mantenimientos,
    pedidos
  };
};

module.exports = { create, getAll, getById, update, remove, getDisponibles, liberarDron, getHistorial };