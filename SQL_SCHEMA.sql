-- ============================================================================
-- FERRETERÍA E-COMMERCE: SCHEMA POSTGRESQL
-- ============================================================================

-- Tabla 1: USUARIOS (Clientes y Administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 2: CATEGORÍAS
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 3: PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    aplicacion_uso TEXT NOT NULL,
    categoria_id INT NOT NULL REFERENCES categorias(id),
    precio_cop NUMERIC(12, 2) NOT NULL CHECK (precio_cop > 0),
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    marca VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 4: CARRITOS
CREATE TABLE carritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 5: ITEMS CARRITO
CREATE TABLE items_carrito (
    id SERIAL PRIMARY KEY,
    carrito_id INT NOT NULL REFERENCES carritos(id),
    producto_id INT NOT NULL REFERENCES productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 6: ÓRDENES
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(20) NOT NULL UNIQUE,
    usuario_id INT NOT NULL REFERENCES usuarios(id),
    subtotal NUMERIC(12, 2) NOT NULL,
    impuesto NUMERIC(12, 2) DEFAULT 0,
    total_cop NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    metodo_pago VARCHAR(50) DEFAULT 'payu',
    referencia_pago VARCHAR(100),
    fecha_pago TIMESTAMP,
    direccion_entrega TEXT,
    ciudad_entrega VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 7: DETALLES ORDEN
CREATE TABLE detalles_orden (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ordenes(id),
    producto_id INT NOT NULL REFERENCES productos(id),
    nombre_producto VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla 8: PAGOS
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL REFERENCES ordenes(id),
    monto NUMERIC(12, 2) NOT NULL,
    estado_pago VARCHAR(30) NOT NULL,
    referencia_payu VARCHAR(100),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERTAR CATEGORÍAS INICIALES
-- ============================================================================

INSERT INTO categorias (nombre, descripcion, orden) VALUES
('Tubería y accesorios en PVC y CPVC', 'Tuberías y conexiones en PVC', 1),
('Canales de drenajes Aco', 'Sistemas de drenaje profesionales', 2),
('Productos Sika', 'Soluciones construcción y sellado', 3),
('Tubería y accesorios ranurados', 'Tuberías ranuradas para instalaciones', 4),
('Galvanizados y cobre', 'Materiales galvanizados y cobre', 5),
('Geotextiles PAVCO', 'Geotextiles de alta resistencia', 6),
('Herramientas profesionales', 'Herramientas de calidad', 7),
('Registros y válvulas', 'Registros y válvulas para tuberías', 8),
('Duchas eléctricas Lorenzzetti', 'Duchas eléctricas instantáneas', 9),
('Grifería', 'Grifería de baño y cocina', 10),
('Lavaplatos', 'Lavaplatos acero y cerámica', 11),
('Porcelana sanitaria', 'Inodoros, lavamanos, bidés', 12);

-- ============================================================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- ============================================================================

INSERT INTO productos (nombre, descripcion, aplicacion_uso, categoria_id, precio_cop, stock, sku, marca, activo) VALUES
('Tubería PVC 3/4" x 3m', 'Tubería de PVC para agua potable', 'Distribución de agua', 1, 45000, 150, 'PVC-34-3M', 'Pavco', TRUE),
('Codo PVC 90° 3/4"', 'Codo de conexión PVC', 'Cambio de dirección', 1, 8500, 200, 'CODO-34-90', 'Pavco', TRUE),
('Union PVC 1/2"', 'Unión para empalmes', 'Conexión de tuberías', 1, 5200, 250, 'UNION-12', 'Pavco', TRUE),
('Llave de paso 3/4"', 'Válvula de corte', 'Control de flujo', 8, 32000, 75, 'LLAVE-34', 'Caleffi', TRUE),
('Duchos Aco Plan 140', 'Canaleta de drenaje', 'Recolección de agua lluvia', 2, 125000, 40, 'ACO-PLAN-140', 'Aco', TRUE),
('Adhesivo Sikaflex', 'Sellador poliuretánico', 'Sellado en construcción', 3, 48000, 100, 'SIKA-FLEX-600', 'Sika', TRUE),
('Ducha Eléctrica Lorenzetti 6800W', 'Ducha calentador instantáneo', 'Agua caliente en baños', 9, 185000, 50, 'LOREN-6800', 'Lorenzzetti', TRUE),
('Grifo Caño Simple Cromo', 'Grifo monomando cromado', 'Instalación en cocina', 10, 95000, 80, 'GRIFO-CROMO-01', 'Colombiana', TRUE),
('Lavaplatos Acero 2 Piezas', 'Fregadero doble acero', 'Lavado en cocina', 11, 425000, 30, 'FREGADERO-2P', 'Tramontina', TRUE),
('Inodoro Porcelana Blanco', 'Inodoro de dos piezas', 'Baño sanitario', 12, 285000, 60, 'INODORO-2P', 'Bellavista', TRUE);