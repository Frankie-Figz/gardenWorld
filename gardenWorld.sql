DROP DATABASE IF EXISTS gardenWorld_db;

CREATE DATABASE gardenWorld_db;

USE gardenWorld_db;

CREATE TABLE product(
    product_id INTEGER(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    department_id INTEGER(11) NOT NULL FOREIGN KEY,
    price NUMERIC(6) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL,
    product_sales NUMERIC(6) NOT NULL);

CREATE TABLE department(
    department_id INTEGER(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100),
    over_head_costs NUMERIC(6) NOT NULL);

CREATE TABLE order(
    order_id INTEGER(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INTEGER(11) NOT NULL,
    order_type 
);

INSERT INTO department(department_name, over_head_costs)
    VALUES ('SEEDS', 100000);
INSERT INTO department(department_name, over_head_costs)
    VALUES ('FERTILIZER', 200000);
INSERT INTO department(department_name, over_head_costs)
    VALUES ('INSECTICIDE', 400000);

INSERT INTO product(product_name, department_id, price, stock_quantity)
    VALUES 
    ('SUNFLOWER SEEDS', 1, 2.50, 100),
    ('TOMATO SEEDS', 1, 5.00, 900),
    ('RICE SEEDS', 1, 1.00, 9000);

INSERT INTO product(product_name, department_id, price, stock_quantity)
    VALUES 
    ('PHOSPHATE', 2, 25.00, 100),
    ('NITROGEN', 2, 50.00, 200),
    ('POTASSIUM', 2, 10.00, 500);