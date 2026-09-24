-- DropIndex
DROP INDEX `uq_tallas_nombre` ON `tallas`;

-- AlterTable
ALTER TABLE `tallas` ADD COLUMN `tipo` ENUM('ropa', 'calzado') NOT NULL DEFAULT 'ropa';

-- Migración de datos (agregada a mano; el resto lo generó `prisma migrate diff`):
-- las tallas de calzado del seed anterior usaban un espacio final para no chocar con
-- el UNIQUE(nombre) ("36 ", "38 ", "40 "). Se marcan como calzado y se les quita el espacio.
-- Se identifican por su rango de orden en el seed (20–29). En una base vacía no afecta nada.
UPDATE `tallas`
SET `tipo` = 'calzado', `nombre` = TRIM(`nombre`)
WHERE `orden` BETWEEN 20 AND 29 AND TRIM(`nombre`) IN ('35', '36', '37', '38', '39', '40');

-- CreateIndex
CREATE UNIQUE INDEX `uq_tallas_nombre_tipo` ON `tallas`(`nombre`, `tipo`);

