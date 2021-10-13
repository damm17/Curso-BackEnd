CREATE SCHEMA `prueba`;
CREATE TABLE `prueba`.`items` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `categoria` VARCHAR(45) NOT NULL,
    `stock` INT UNSIGNED NULL,
    PRIMARY KEY (`id`));
INSERT INTO items (nombre, categoria, stock) VALUES ('Fideos', 'Harina', 20);
INSERT INTO items (nombre, categoria, stock) VALUES ('Leche', 'Lácteos', 30);
INSERT INTO items (nombre, categoria, stock) VALUES ('Crema', 'Lácteos', 15);
SELECT * FROM items;
DELETE FROM items WHERE id = 1;
UPDATE items SET stock = 45 WHERE id = 2;
SELECT * FROM items;