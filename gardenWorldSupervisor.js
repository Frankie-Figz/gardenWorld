var inquirer = require('Inquirer');
var mysql = require('mysql');
require("dotenv").config();

// Adding the keys import class
var keys = require("./keys.js");

// Global variable used to return the qty on hand
var currentQtyProduct = 0;
var inquirerProducyQty = 0;
var currentProductID = 0;

var connection = mysql.createConnection({
    host: keys.mysqlEnv.host_name,
    // Your port; if not 3306
    port: keys.mysqlEnv.port,
    // Your username
    user: keys.mysqlEnv.user_name,
    // Your password
    password: keys.mysqlEnv.password,
    database: keys.mysqlEnv.database
});

function createNewDepartment(){};

function viewProductSalesDepartment(){};