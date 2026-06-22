const { z } = require('zod');

const createPedidoSchema = z.object({
  id_farmacia: z.number().int({ message: 'ID de farmacia inválido' }).positive({ message: 'ID de farmacia inválido' }),
  subtotal: z.number().positive({ message: 'El subtotal debe ser mayor a 0' }),
  cargo_dron: z.number().positive({ message: 'El cargo del dron debe ser mayor a 0' }).optional().default(5000),
  iva: z.number().positive({ message: 'El IVA debe ser mayor a 0' }),
  total: z.number().positive({ message: 'El total debe ser mayor a 0' }),
  destino_nombre: z.string().max(80, { message: 'El nombre de destino no puede exceder 80 caracteres' }).optional().default(''),
  destino_direccion: z.string().max(150, { message: 'La dirección de destino no puede exceder 150 caracteres' }).optional().default(''),
  latitud_entrega: z.string().max(50, { message: 'La latitud no puede exceder 50 caracteres' }).optional().default(''),
  longitud_entrega: z.string().max(50, { message: 'La longitud no puede exceder 50 caracteres' }).optional().default(''),
  productos: z.array(z.object({
    id_producto: z.number().int({ message: 'ID de producto inválido' }).positive({ message: 'ID de producto inválido' }),
    nombre_producto: z.string().max(100, { message: 'El nombre del producto no puede exceder 100 caracteres' }),
    cantidad: z.number().int({ message: 'La cantidad debe ser un número entero' }).positive({ message: 'La cantidad debe ser mayor a 0' }),
    precio_unitario: z.number().positive({ message: 'El precio unitario debe ser mayor a 0' })
  })).min(1, { message: 'Debe incluir al menos un producto' })
});

const updateEstadoSchema = z.object({
  estado_pedido: z.enum(['Pendiente', 'Pagado', 'Preparado', 'En transito', 'Entregado', 'Cancelado', 'Reembolsado'], { message: 'Estado de pedido inválido' })
});

module.exports = { createPedidoSchema, updateEstadoSchema };