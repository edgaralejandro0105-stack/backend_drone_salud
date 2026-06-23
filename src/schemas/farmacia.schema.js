const { z } = require('zod');

const createFarmaciaSchema = z.object({
  rif: z.string().min(5, { message: 'El RIF debe tener al menos 5 caracteres' }).max(20, { message: 'El RIF no puede exceder 20 caracteres' }),
  nombre_comercial: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }).max(100, { message: 'El nombre no puede exceder 100 caracteres' }),
  telefono: z.string().max(15, { message: 'El teléfono no puede exceder 15 caracteres' }).optional().default(''),
  telefono_responsable: z.string().max(15, { message: 'El teléfono del responsable no puede exceder 15 caracteres' }).optional().default(''),
  email: z.string().email({ message: 'Correo electrónico inválido' }).max(60, { message: 'El correo no puede exceder 60 caracteres' }).optional().default(''),
  ciudad: z.string().max(50, { message: 'La ciudad no puede exceder 50 caracteres' }).optional().default(''),
  direccion: z.string().max(150, { message: 'La dirección no puede exceder 150 caracteres' }).optional().default(''),
  lat: z.string().max(50, { message: 'La latitud no puede exceder 50 caracteres' }).optional().default(''),
  lng: z.string().max(50, { message: 'La longitud no puede exceder 50 caracteres' }).optional().default(''),
  logo_url: z.string().optional().default(''),
  foto_fachada_url: z.string().optional().default(''),
  pago_movil_banco: z.string().max(50, { message: 'El banco no puede exceder 50 caracteres' }).optional().default(''),
  pago_movil_telefono: z.string().max(15, { message: 'El teléfono de pago móvil no puede exceder 15 caracteres' }).optional().default(''),
  pago_movil_ci: z.string().max(15, { message: 'La cédula de pago móvil no puede exceder 15 caracteres' }).optional().default(''),
  pago_movil_titular: z.string().max(60, { message: 'El titular de pago móvil no puede exceder 60 caracteres' }).optional().default('')
});

module.exports = { createFarmaciaSchema };