const { z } = require('zod');

const registerSchema = z.object({
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }).max(60, { message: 'El nombre no puede exceder 60 caracteres' }),
  apellido: z.string().max(60, { message: 'El apellido no puede exceder 60 caracteres' }).optional().default(''),
  cedula: z.string().min(5, { message: 'La cédula debe tener al menos 5 caracteres' }).max(15, { message: 'La cédula no puede exceder 15 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }).max(60, { message: 'El correo no puede exceder 60 caracteres' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }).max(255, { message: 'La contraseña no puede exceder 255 caracteres' }),
  telefono: z.string().max(15, { message: 'El teléfono no puede exceder 15 caracteres' }).optional().default(''),
  tipo_usuario: z.enum(['admin', 'cliente', 'farmacia', 'operador'], { message: 'Tipo de usuario inválido' }),
  direccion: z.string().max(150, { message: 'La dirección no puede exceder 150 caracteres' }).optional().default(''),
  id_farmacia: z.number().int({ message: 'ID de farmacia inválido' }).positive({ message: 'ID de farmacia inválido' }).optional()
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }).max(60, { message: 'El correo no puede exceder 60 caracteres' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' })
});

module.exports = { registerSchema, loginSchema };