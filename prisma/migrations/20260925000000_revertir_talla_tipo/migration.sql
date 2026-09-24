-- Revierte 20260924233000_talla_tipo. El DDL (desde "-- DropIndex") lo generó `prisma migrate diff`;
-- los dos pasos previos se agregaron a mano.

-- 1. Resguardo: si alguna talla de calzado está asignada a un producto, se aborta ANTES de cualquier DDL
--    (en MySQL el DDL no es transaccional; fallar a mitad dejaría la tabla a medio migrar).
--    Borrarla eliminaría en cascada esas asignaciones en producto_tallas. El error mostrará el nombre
--    del CHECK: "talla_calzado_en_uso_revisar_producto_tallas". Hay que reasignar esos productos a mano.
CREATE TEMPORARY TABLE `_resguardo_revertir_talla_tipo` (
  `talla_id` BIGINT UNSIGNED NULL,
  CONSTRAINT `talla_calzado_en_uso_revisar_producto_tallas` CHECK (`talla_id` IS NULL)
);
INSERT INTO `_resguardo_revertir_talla_tipo` (`talla_id`)
SELECT DISTINCT `t`.`id` FROM `tallas` `t`
JOIN `producto_tallas` `pt` ON `pt`.`talla_id` = `t`.`id`
WHERE `t`.`tipo` = 'calzado';
DROP TEMPORARY TABLE `_resguardo_revertir_talla_tipo`;

-- 2. Las tallas de calzado salen del seed; sin este DELETE, "36" (ropa) y "36" (calzado)
--    chocarían con el UNIQUE(nombre) que se recrea abajo.
DELETE FROM `tallas` WHERE `tipo` = 'calzado';

-- DropIndex
DROP INDEX `uq_tallas_nombre_tipo` ON `tallas`;

-- AlterTable
ALTER TABLE `tallas` DROP COLUMN `tipo`;

-- CreateIndex
CREATE UNIQUE INDEX `uq_tallas_nombre` ON `tallas`(`nombre`);

