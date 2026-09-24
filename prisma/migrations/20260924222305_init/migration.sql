-- Editado a mano tras generarlo:
--   * COLLATE utf8mb4_0900_ai_ci (default de MySQL 8, igual que el schema legacy) en vez de
--     utf8mb4_unicode_ci: esta última es PAD SPACE y haría chocar las tallas "36" y "36 " del seed.
--   * ON UPDATE CURRENT_TIMESTAMP en updated_at, igual que el schema legacy (Prisma no lo modela;
--     @updatedAt lo cubre desde Prisma Client, esto lo cubre también para SQL directo).

-- CreateTable
CREATE TABLE `usuarios` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `email` VARCHAR(160) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `rol` ENUM('admin', 'editor', 'cliente') NOT NULL DEFAULT 'editor',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_usuarios_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `orden` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `uq_categorias_slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `subcategorias` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `categoria_id` BIGINT UNSIGNED NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_subcategorias_slug`(`slug`),
    INDEX `fk_subcategorias_categoria`(`categoria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `marcas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_marcas_slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `tallas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `uq_tallas_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `colores` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `hex` CHAR(7) NULL,

    UNIQUE INDEX `uq_colores_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `materiales` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `uq_materiales_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `temporadas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` ENUM('Verano', 'Otoño', 'Invierno', 'Primavera') NOT NULL,

    UNIQUE INDEX `uq_temporadas_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `colecciones` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_colecciones_slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `uq_tags_slug`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `origenes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `tipo` ENUM('pais', 'importadora', 'cliente', 'donacion', 'compra_directa') NOT NULL DEFAULT 'pais',

    UNIQUE INDEX `uq_origenes_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `descripcion_corta` VARCHAR(255) NULL,
    `descripcion_larga` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `precio_anterior` DECIMAL(10, 2) NULL,
    `tipo_descuento` ENUM('ninguno', 'porcentaje', 'monto_fijo', '2x1', '3x2') NOT NULL DEFAULT 'ninguno',
    `valor_descuento` DECIMAL(10, 2) NULL,
    `precio_final` DECIMAL(10, 2) NOT NULL,
    `categoria_id` BIGINT UNSIGNED NOT NULL,
    `subcategoria_id` BIGINT UNSIGNED NULL,
    `marca_id` BIGINT UNSIGNED NOT NULL,
    `origen_id` BIGINT UNSIGNED NOT NULL,
    `temporada_id` BIGINT UNSIGNED NULL,
    `coleccion_id` BIGINT UNSIGNED NULL,
    `material_principal_id` BIGINT UNSIGNED NULL,
    `color_principal_id` BIGINT UNSIGNED NULL,
    `estado` ENUM('disponible', 'reservada', 'en_negociacion', 'vendida', 'agotada', 'oculta', 'archivada') NOT NULL DEFAULT 'disponible',
    `destacado` BOOLEAN NOT NULL DEFAULT false,
    `nuevo` BOOLEAN NOT NULL DEFAULT true,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `peso_kg` DECIMAL(6, 3) NULL,
    `pais_fabricacion` VARCHAR(80) NULL,
    `fecha_ingreso` DATE NOT NULL,
    `fecha_venta` DATE NULL,
    `notas_internas` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_productos_sku`(`sku`),
    UNIQUE INDEX `uq_productos_slug`(`slug`),
    INDEX `idx_productos_categoria`(`categoria_id`),
    INDEX `idx_productos_marca`(`marca_id`),
    INDEX `idx_productos_estado`(`estado`),
    INDEX `idx_productos_destacado_visible`(`destacado`, `visible`),
    INDEX `idx_productos_nuevo_visible`(`nuevo`, `visible`),
    INDEX `idx_productos_coleccion`(`coleccion_id`),
    INDEX `fk_productos_subcategoria`(`subcategoria_id`),
    INDEX `fk_productos_origen`(`origen_id`),
    INDEX `fk_productos_temporada`(`temporada_id`),
    INDEX `fk_productos_material`(`material_principal_id`),
    INDEX `fk_productos_color`(`color_principal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `producto_imagenes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `es_principal` BOOLEAN NOT NULL DEFAULT false,

    INDEX `idx_producto_imagenes_producto`(`producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `producto_tallas` (
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `talla_id` BIGINT UNSIGNED NOT NULL,

    INDEX `fk_pt_talla`(`talla_id`),
    PRIMARY KEY (`producto_id`, `talla_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `producto_colores` (
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `color_id` BIGINT UNSIGNED NOT NULL,

    INDEX `fk_pc_color`(`color_id`),
    PRIMARY KEY (`producto_id`, `color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `producto_materiales` (
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `material_id` BIGINT UNSIGNED NOT NULL,

    INDEX `fk_pm_material`(`material_id`),
    PRIMARY KEY (`producto_id`, `material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `producto_tags` (
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `tag_id` BIGINT UNSIGNED NOT NULL,

    INDEX `fk_ptag_tag`(`tag_id`),
    PRIMARY KEY (`producto_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,
    `apellido` VARCHAR(80) NULL,
    `instagram` VARCHAR(80) NULL,
    `facebook` VARCHAR(120) NULL,
    `telefono` VARCHAR(30) NULL,
    `email` VARCHAR(160) NULL,
    `ciudad` VARCHAR(80) NULL,
    `comuna` VARCHAR(80) NULL,
    `cumpleanos` DATE NULL,
    `observaciones` TEXT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ultimo_contacto` DATETIME(0) NULL,
    `cliente_frecuente` BOOLEAN NOT NULL DEFAULT false,

    INDEX `idx_clientes_email`(`email`),
    INDEX `idx_clientes_telefono`(`telefono`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `intereses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cliente_id` BIGINT UNSIGNED NOT NULL,
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `estado` ENUM('consulto', 'probo', 'reservo', 'compro', 'no_respondio', 'no_le_quedo', 'esperando_stock') NOT NULL DEFAULT 'consulto',
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `notas` VARCHAR(255) NULL,

    INDEX `idx_intereses_cliente`(`cliente_id`),
    INDEX `idx_intereses_producto`(`producto_id`),
    INDEX `idx_intereses_estado`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `favoritos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cliente_id` BIGINT UNSIGNED NOT NULL,
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_favoritos_producto`(`producto_id`),
    UNIQUE INDEX `uq_favoritos_cliente_producto`(`cliente_id`, `producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `historial_cliente` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cliente_id` BIGINT UNSIGNED NOT NULL,
    `usuario_id` BIGINT UNSIGNED NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(500) NOT NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_historial_cliente`(`cliente_id`),
    INDEX `fk_historial_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `pipeline_etapas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(40) NOT NULL,
    `orden` INTEGER NOT NULL,

    UNIQUE INDEX `uq_pipeline_etapas_nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `pipeline_movimientos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cliente_id` BIGINT UNSIGNED NOT NULL,
    `etapa_id` BIGINT UNSIGNED NOT NULL,
    `producto_id` BIGINT UNSIGNED NULL,
    `usuario_id` BIGINT UNSIGNED NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `notas` VARCHAR(255) NULL,

    INDEX `idx_pipeline_mov_cliente`(`cliente_id`),
    INDEX `idx_pipeline_mov_etapa`(`etapa_id`),
    INDEX `fk_pipeline_mov_producto`(`producto_id`),
    INDEX `fk_pipeline_mov_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cliente_id` BIGINT UNSIGNED NOT NULL,
    `fecha` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `forma_pago` ENUM('efectivo', 'transferencia', 'tarjeta', 'otro') NOT NULL DEFAULT 'transferencia',
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `notas` VARCHAR(255) NULL,

    INDEX `idx_ventas_cliente`(`cliente_id`),
    INDEX `idx_ventas_fecha`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `venta_items` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `venta_id` BIGINT UNSIGNED NOT NULL,
    `producto_id` BIGINT UNSIGNED NOT NULL,
    `precio_original` DECIMAL(10, 2) NOT NULL,
    `precio_vendido` DECIMAL(10, 2) NOT NULL,
    `descuento` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    INDEX `idx_venta_items_venta`(`venta_id`),
    INDEX `idx_venta_items_producto`(`producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `configuraciones` (
    `clave` VARCHAR(80) NOT NULL,
    `valor` TEXT NULL,

    PRIMARY KEY (`clave`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `suscriptores` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(160) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_suscripcion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_suscriptores_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- AddForeignKey
ALTER TABLE `subcategorias` ADD CONSTRAINT `fk_subcategorias_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_subcategoria` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_marca` FOREIGN KEY (`marca_id`) REFERENCES `marcas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_origen` FOREIGN KEY (`origen_id`) REFERENCES `origenes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_temporada` FOREIGN KEY (`temporada_id`) REFERENCES `temporadas`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_coleccion` FOREIGN KEY (`coleccion_id`) REFERENCES `colecciones`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_material` FOREIGN KEY (`material_principal_id`) REFERENCES `materiales`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_color` FOREIGN KEY (`color_principal_id`) REFERENCES `colores`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_imagenes` ADD CONSTRAINT `fk_producto_imagenes_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_tallas` ADD CONSTRAINT `fk_pt_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_tallas` ADD CONSTRAINT `fk_pt_talla` FOREIGN KEY (`talla_id`) REFERENCES `tallas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_colores` ADD CONSTRAINT `fk_pc_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_colores` ADD CONSTRAINT `fk_pc_color` FOREIGN KEY (`color_id`) REFERENCES `colores`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_materiales` ADD CONSTRAINT `fk_pm_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_materiales` ADD CONSTRAINT `fk_pm_material` FOREIGN KEY (`material_id`) REFERENCES `materiales`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_tags` ADD CONSTRAINT `fk_ptag_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto_tags` ADD CONSTRAINT `fk_ptag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `intereses` ADD CONSTRAINT `fk_intereses_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `intereses` ADD CONSTRAINT `fk_intereses_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `fk_favoritos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `fk_favoritos_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historial_cliente` ADD CONSTRAINT `fk_historial_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historial_cliente` ADD CONSTRAINT `fk_historial_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pipeline_movimientos` ADD CONSTRAINT `fk_pipeline_mov_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pipeline_movimientos` ADD CONSTRAINT `fk_pipeline_mov_etapa` FOREIGN KEY (`etapa_id`) REFERENCES `pipeline_etapas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pipeline_movimientos` ADD CONSTRAINT `fk_pipeline_mov_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pipeline_movimientos` ADD CONSTRAINT `fk_pipeline_mov_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ventas` ADD CONSTRAINT `fk_ventas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `venta_items` ADD CONSTRAINT `fk_venta_items_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `venta_items` ADD CONSTRAINT `fk_venta_items_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
