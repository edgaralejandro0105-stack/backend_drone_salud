const { z } = require('zod');

const createProductoSchema = z.object({
  id_farmacia: z.number().int({ message: 'ID de farmacia inválido' }).positive({ message: 'ID de farmacia inválido' }),
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).max(100, { message: 'El nombre no puede exceder 100 caracteres' }),
  concentracion: z.string().max(30, { message: 'La concentración no puede exceder 30 caracteres' }).optional().default(''),
  categoria: z.string().max(30, { message: 'La categoría no puede exceder 30 caracteres' }).optional().default(''),
  unidad_medida: z.string().max(20, { message: 'La unidad de medida no puede exceder 20 caracteres' }).optional().default('Unidades'),
  precio: z.number().positive({ message: 'El precio debe ser mayor a 0' }),
  stock_actual: z.number().int({ message: 'El stock debe ser un número entero' }).min(0, { message: 'El stock no puede ser negativo' }).optional().default(0),
  stock_minimo: z.number().int({ message: 'El stock mínimo debe ser un número entero' }).min(0, { message: 'El stock mínimo no puede ser negativo' }).optional().default(10),
  requiere_prescripcion: z.boolean().optional().default(false),
  especificaciones: z.string().optional().default(''),
  foto_url: z.string().optional().default('')
});

const updateProductoSchema = createProductoSchema.partial();

module.exports = { createProductoSchema, updateProductoSchema };