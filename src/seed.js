require('dotenv').config();
const { sequelize } = require('./models');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const Usuario = require('./models/Usuario');
const Farmacia = require('./models/Farmacia');
const Producto = require('./models/Producto');
const FlotaDron = require('./models/FlotaDron');
const OperadorVuelo = require('./models/OperadorVuelo');
const Pedido = require('./models/Pedido');
const DetallePedido = require('./models/DetallePedido');
const Pago = require('./models/Pago');

const seed = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('BD sincronizada');

    // Admin
    await Usuario.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL || 'admin@dronsalud.com' },
      defaults: {
        nombre: 'Edgar Alejandro',
        apellido: 'Admin',
        cedula: 'V-12345678',
        email: process.env.ADMIN_EMAIL || 'admin@dronsalud.com',
        password_hash: hashPassword('admin123'),
        telefono: '04121234567',
        tipo_usuario: 'admin',
        estado_cuenta: 'Activo'
      }
    });
    console.log('✓ Admin creado');

    // Farmacias
    const [farmacia1] = await Farmacia.findOrCreate({
      where: { rif: 'J-12345678-9' },
      defaults: {
        rif: 'J-12345678-9',
        nombre_comercial: 'Farmacia Central',
        razon_social: 'Central C.A.',
        telefono: '02121234567',
        email: 'central@farmacia.com',
        ciudad: 'Caracas',
        direccion: 'Av. Principal, C.C. Central',
        lat: '10.4806',
        lng: '-66.9036',
        estado_operativo: true,
        verificada: true
      }
    });

    const [farmacia2] = await Farmacia.findOrCreate({
      where: { rif: 'J-87654321-0' },
      defaults: {
        rif: 'J-87654321-0',
        nombre_comercial: 'Farmacia del Este',
        razon_social: 'Del Este S.A.',
        telefono: '02129876543',
        email: 'este@farmacia.com',
        ciudad: 'Caracas',
        direccion: 'Av. Francisco de Miranda',
        lat: '10.4961',
        lng: '-66.8300',
        estado_operativo: true,
        verificada: true
      }
    });

    console.log('✓ Farmacias creadas');

    // Usuarios de farmacia (para que puedan iniciar sesion)
    const farmaciasUsuarios = [
      { farmacia: farmacia1, email: 'central@farmacia.com', password: 'J-12345678-9Drone' },
      { farmacia: farmacia2, email: 'este@farmacia.com', password: 'J-87654321-0Drone' },
    ];

    for (const fu of farmaciasUsuarios) {
      await Usuario.findOrCreate({
        where: { email: fu.email },
        defaults: {
          nombre: fu.farmacia.nombre_comercial,
          cedula: fu.farmacia.rif,
          email: fu.email,
          password_hash: hashPassword(fu.password),
          telefono: fu.farmacia.telefono || '',
          tipo_usuario: 'farmacia',
          id_farmacia: fu.farmacia.id_farmacia,
          estado_cuenta: 'Activo'
        }
      });
    }
    console.log('✓ Usuarios de farmacia creados');

    // Productos
    const productosData = [
      { id_farmacia: farmacia1.id_farmacia, nombre: 'Paracetamol 500mg', categoria: 'Analgesicos', precio: 2.50, stock_actual: 100 },
      { id_farmacia: farmacia1.id_farmacia, nombre: 'Amoxicilina 500mg', categoria: 'Antibioticos', precio: 5.00, stock_actual: 50, requiere_prescripcion: true },
      { id_farmacia: farmacia1.id_farmacia, nombre: 'Ibuprofeno 400mg', categoria: 'Antiinflamatorios', precio: 3.00, stock_actual: 80 },
      { id_farmacia: farmacia2.id_farmacia, nombre: 'Loratadina 10mg', categoria: 'Antialergicos', precio: 4.00, stock_actual: 60 },
      { id_farmacia: farmacia2.id_farmacia, nombre: 'Omeprazol 20mg', categoria: 'Gastrointestinales', precio: 6.00, stock_actual: 40 },
    ];

    for (const p of productosData) {
      await Producto.findOrCreate({
        where: { nombre: p.nombre, id_farmacia: p.id_farmacia },
        defaults: p
      });
    }
    console.log('✓ Productos creados');

    // Drones
    const dronesData = [
      { modelo: 'DJI Mavic 3', fabricante: 'DJI', matricula: 'DRN-001', numero_serie: 'SN001', peso_maximo_despegue_kg: 9.0, estado_operativo: 'Disponible' },
      { modelo: 'DJI Phantom 4', fabricante: 'DJI', matricula: 'DRN-002', numero_serie: 'SN002', peso_maximo_despegue_kg: 6.0, estado_operativo: 'Disponible' },
      { modelo: 'Autel EVO II', fabricante: 'Autel', matricula: 'DRN-003', numero_serie: 'SN003', peso_maximo_despegue_kg: 8.0, estado_operativo: 'Mantenimiento' },
    ];

    for (const d of dronesData) {
      await FlotaDron.findOrCreate({
        where: { matricula: d.matricula },
        defaults: d
      });
    }
    console.log('✓ Drones creados');

    // Operador - usuario
    const [operadorUser] = await Usuario.findOrCreate({
      where: { email: 'carlos@dronsalud.com' },
      defaults: {
        nombre: 'Carlos Pérez',
        cedula: 'V-87654321',
        email: 'carlos@dronsalud.com',
        password_hash: hashPassword('operador123'),
        telefono: '04141234567',
        tipo_usuario: 'operador',
        estado_cuenta: 'Activo'
      }
    });

    await OperadorVuelo.findOrCreate({
      where: { nro_licencia: 'LIC-001' },
      defaults: {
        id_usuario: operadorUser.id_usuario,
        cedula: 'V-87654321',
        nombre_operador: 'Carlos Pérez',
        telefono: '04141234567',
        email: 'carlos@dronsalud.com',
        nro_licencia: 'LIC-001',
        tipo_licencia: 'Comercial',
        horas_vuelo: 150.5,
        estado_disponibilidad: true
      }
    });
    console.log('✓ Operadores creados');

    console.log('\n✅ Seed completado exitosamente');
    console.log('📧 Admin email:', process.env.ADMIN_EMAIL || 'admin@dronsalud.com');
    console.log('🔑 Admin password: admin123');
    console.log('🏪 Farmacia Central - Email: central@farmacia.com - Pass: J-12345678-9Drone');
    console.log('🏪 Farmacia del Este - Email: este@farmacia.com - Pass: J-87654321-0Drone');
    console.log('👨‍✈️ Operador - Email: carlos@dronsalud.com - Pass: operador123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

seed();
