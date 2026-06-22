-- ============================================
-- SCHEMA: DronSalud - PostgreSQL
-- Tablas en minúscula (sin comillas)
-- Compatible con Sequelize y SQL directo
-- ============================================

CREATE TABLE farmacias_asociadas (
  id_farmacia SERIAL PRIMARY KEY,
  rif VARCHAR(20) NOT NULL UNIQUE,
  nombre_comercial VARCHAR(100) NOT NULL,
  razon_social VARCHAR(150) NOT NULL DEFAULT '',
  telefono VARCHAR(15) NOT NULL DEFAULT '',
  email VARCHAR(60) NOT NULL DEFAULT '',
  ciudad VARCHAR(50) NOT NULL DEFAULT '',
  direccion VARCHAR(150) NOT NULL DEFAULT '',
  lat VARCHAR(50) NOT NULL DEFAULT '',
  lng VARCHAR(50) NOT NULL DEFAULT '',
  logo_url TEXT DEFAULT '',
  foto_fachada_url TEXT DEFAULT '',
  pago_movil_banco VARCHAR(50) DEFAULT '',
  pago_movil_telefono VARCHAR(15) DEFAULT '',
  pago_movil_ci VARCHAR(15) DEFAULT '',
  pago_movil_titular VARCHAR(60) DEFAULT '',
  estado_operativo BOOLEAN NOT NULL DEFAULT true,
  verificada BOOLEAN NOT NULL DEFAULT false,
  fecha_verificacion TIMESTAMP
);

CREATE INDEX idx_farmacias_rif ON farmacias_asociadas(rif);
CREATE INDEX idx_farmacias_ciudad ON farmacias_asociadas(ciudad);

CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL DEFAULT '',
  cedula VARCHAR(15) NOT NULL,
  email VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(15) NOT NULL DEFAULT '',
  tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('admin','cliente','farmacia','operador')),
  direccion VARCHAR(150) DEFAULT '',
  id_farmacia INTEGER REFERENCES farmacias_asociadas(id_farmacia),
  estado_cuenta VARCHAR(15) NOT NULL DEFAULT 'Activo' CHECK (estado_cuenta IN ('Activo','Suspendido','Inactivo')),
  ultimo_acceso TIMESTAMP,
  fecha_registro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_farmacia ON usuarios(id_farmacia);

CREATE TABLE horarios_farmacia (
  id_horario SERIAL PRIMARY KEY,
  id_farmacia INTEGER NOT NULL REFERENCES farmacias_asociadas(id_farmacia) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
  hora_apertura TIME NOT NULL,
  hora_cierre TIME NOT NULL,
  abierto BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(id_farmacia, dia_semana, hora_apertura)
);

CREATE INDEX idx_horarios_farmacia ON horarios_farmacia(id_farmacia);

CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  id_farmacia INTEGER NOT NULL REFERENCES farmacias_asociadas(id_farmacia) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  concentracion VARCHAR(30) DEFAULT '',
  categoria VARCHAR(30) DEFAULT '',
  unidad_medida VARCHAR(20) NOT NULL DEFAULT 'Unidades',
  precio DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
  stock_actual INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo INTEGER NOT NULL DEFAULT 10 CHECK (stock_minimo >= 0),
  requiere_prescripcion BOOLEAN NOT NULL DEFAULT false,
  especificaciones TEXT DEFAULT '',
  foto_url TEXT DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_productos_farmacia ON productos(id_farmacia);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_nombre ON productos(nombre);

CREATE TABLE operadores_vuelo (
  id_operador SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuario),
  cedula VARCHAR(15) NOT NULL,
  nombre_operador VARCHAR(60) NOT NULL,
  telefono VARCHAR(15) DEFAULT '',
  email VARCHAR(60) DEFAULT '',
  nro_licencia VARCHAR(50) NOT NULL UNIQUE,
  tipo_licencia VARCHAR(50) DEFAULT '',
  horas_vuelo DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (horas_vuelo >= 0),
  foto_url TEXT DEFAULT '',
  estado_disponibilidad BOOLEAN NOT NULL DEFAULT true,
  fecha_ingreso DATE
);

CREATE INDEX idx_operadores_usuario ON operadores_vuelo(id_usuario);
CREATE INDEX idx_operadores_disponibilidad ON operadores_vuelo(estado_disponibilidad);

CREATE TABLE flota_drones (
  id_dron SERIAL PRIMARY KEY,
  modelo VARCHAR(50) NOT NULL,
  fabricante VARCHAR(30) DEFAULT '',
  matricula VARCHAR(50) NOT NULL UNIQUE,
  numero_serie VARCHAR(50) UNIQUE,
  peso_maximo_despegue_kg DECIMAL(6,2),
  velocidad_crucero_nudos DECIMAL(6,2),
  fecha_adquisicion DATE,
  estado_operativo VARCHAR(20) NOT NULL DEFAULT 'Disponible' CHECK (estado_operativo IN ('Disponible','En vuelo','Cargando','Mantenimiento','Baja')),
  bateria_porcentaje INTEGER NOT NULL DEFAULT 100 CHECK (bateria_porcentaje BETWEEN 0 AND 100),
  ubicacion VARCHAR(50) DEFAULT '',
  horas_vuelo DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (horas_vuelo >= 0),
  foto_url TEXT DEFAULT ''
);

CREATE INDEX idx_drones_estado ON flota_drones(estado_operativo);
CREATE INDEX idx_drones_matricula ON flota_drones(matricula);

CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_farmacia INTEGER NOT NULL REFERENCES farmacias_asociadas(id_farmacia),
  id_dron INTEGER REFERENCES flota_drones(id_dron),
  id_operador INTEGER REFERENCES operadores_vuelo(id_operador),
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
  estado_pedido VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado_pedido IN ('Pendiente','Pagado','Preparado','En transito','Entregado','Cancelado','Reembolsado')),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  cargo_dron DECIMAL(12,2) NOT NULL DEFAULT 5000 CHECK (cargo_dron >= 0),
  iva DECIMAL(12,2) NOT NULL CHECK (iva >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  destino_nombre VARCHAR(80) DEFAULT '',
  destino_direccion VARCHAR(150) DEFAULT '',
  latitud_entrega VARCHAR(50) DEFAULT '',
  longitud_entrega VARCHAR(50) DEFAULT '',
  clima_verificado BOOLEAN NOT NULL DEFAULT false,
  timestamp_inicio TIMESTAMP,
  timestamp_fin TIMESTAMP,
  consumo_energetico_mah INTEGER
);

CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_farmacia ON pedidos(id_farmacia);
CREATE INDEX idx_pedidos_estado ON pedidos(estado_pedido);
CREATE INDEX idx_pedidos_dron ON pedidos(id_dron);
CREATE INDEX idx_pedidos_operador ON pedidos(id_operador);

CREATE TABLE detalle_pedido (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto INTEGER NOT NULL REFERENCES productos(id_producto),
  nombre_producto VARCHAR(100) NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0)
);

CREATE INDEX idx_detalle_pedido ON detalle_pedido(id_pedido);
CREATE INDEX idx_detalle_producto ON detalle_pedido(id_producto);

CREATE TABLE pagos (
  id_pago SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL UNIQUE REFERENCES pedidos(id_pedido),
  id_cliente INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_farmacia INTEGER NOT NULL REFERENCES farmacias_asociadas(id_farmacia),
  metodo VARCHAR(20) NOT NULL CHECK (metodo IN ('PagoMovil','Transferencia','Efectivo','Zelle','PuntoDeVenta')),
  monto DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
  referencia VARCHAR(50) DEFAULT '',
  estado_pago VARCHAR(15) NOT NULL DEFAULT 'Pendiente' CHECK (estado_pago IN ('Pendiente','Confirmado','Rechazado','Reembolsado')),
  datos_adicionales JSONB,
  fecha_pago TIMESTAMP NOT NULL DEFAULT NOW(),
  fecha_confirmacion TIMESTAMP
);

CREATE INDEX idx_pagos_pedido ON pagos(id_pedido);
CREATE INDEX idx_pagos_estado ON pagos(estado_pago);

CREATE TABLE mantenimiento_drones (
  id_mantenimiento SERIAL PRIMARY KEY,
  id_dron INTEGER NOT NULL REFERENCES flota_drones(id_dron) ON DELETE CASCADE,
  id_operador INTEGER REFERENCES operadores_vuelo(id_operador),
  tipo_servicio VARCHAR(30) NOT NULL CHECK (tipo_servicio IN ('Preventivo','Correctivo','Inspeccion','Reparacion')),
  descripcion_falla TEXT DEFAULT '',
  piezas_reemplazadas TEXT DEFAULT '',
  costo DECIMAL(12,2) DEFAULT 0 CHECK (costo >= 0),
  fecha_ingreso TIMESTAMP NOT NULL DEFAULT NOW(),
  fecha_completado TIMESTAMP,
  estado VARCHAR(15) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','En progreso','Completado'))
);

CREATE INDEX idx_mantenimiento_dron ON mantenimiento_drones(id_dron);

CREATE TABLE bitacora_telemetria (
  id_log SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  fase_vuelo VARCHAR(30) NOT NULL CHECK (fase_vuelo IN ('Despegue','Ruta','Aproximacion','Aterrizaje')),
  latitud_actual VARCHAR(50) DEFAULT '',
  longitud_actual VARCHAR(50) DEFAULT '',
  altitud DECIMAL(8,2),
  velocidad_nudos DECIMAL(6,2),
  bateria_restante INTEGER,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telemetria_pedido ON bitacora_telemetria(id_pedido);
CREATE INDEX idx_telemetria_timestamp ON bitacora_telemetria(timestamp);

CREATE TABLE direcciones_cliente (
  id_direccion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  nombre_direccion VARCHAR(50) NOT NULL,
  direccion VARCHAR(150) NOT NULL,
  ciudad VARCHAR(50) DEFAULT '',
  latitud VARCHAR(50) DEFAULT '',
  longitud VARCHAR(50) DEFAULT ''
);

CREATE INDEX idx_direcciones_usuario ON direcciones_cliente(id_usuario);

CREATE TABLE calificaciones (
  id_calificacion SERIAL PRIMARY KEY,
  id_pedido INTEGER NOT NULL UNIQUE REFERENCES pedidos(id_pedido),
  id_cliente INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  id_farmacia INTEGER NOT NULL REFERENCES farmacias_asociadas(id_farmacia),
  id_operador INTEGER REFERENCES operadores_vuelo(id_operador),
  puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT DEFAULT '',
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calificaciones_farmacia ON calificaciones(id_farmacia);
CREATE INDEX idx_calificaciones_operador ON calificaciones(id_operador);
