var inquirer = require('Inquirer');
var mysql = require('mysql');
require("dotenv").config();

// Adding the keys import class
var keys = require("./keys.js");

// The connection variable
var connection = mysql.createConnection({
    // Your host
    host: keys.mysqlEnv.host_name,
    // Your port
    port: keys.mysqlEnv.port,
    // Your username
    user: keys.mysqlEnv.user_name,
    // Your password
    password: keys.mysqlEnv.password,
    // Your database
    database: keys.mysqlEnv.database
});

// Generate the ID choices for the user
function createChoicesArray(a){
    let arrayID = [];
    for(var i in a)
        arrayID.push(a[i].product_id);
    console.log(arrayID);
    return arrayID;
};

// Display the product catalogue on the console
function viewProductCatalogue(){
    let sqlQuery = "SELECT * FROM product";
    connection.query(sqlQuery, function (err, response) {
      if (err) {
        console.log("Error displaying products: " + err);
        connection.end();
      } else {
        console.log("------------------------------");
        // A console log to verify that the createChoicesArray returns the appropriate values.
        // console.log(createChoicesArray(response));
        // Iterate over the response to draw the table that will be displayed to the user.
        for (var i = 0; i < response.length; i++)
          console.log(response[i].product_id + " : " + response[i].product_name + " : " + response[i].department_id + " : " + response[i].stock_quantity + " : " + response[i].product_sales);       
        console.log("------------------------------");
        }
    });
};

// Display the products in the inventory whose stock quantity is less than 5
function viewLowInventory(){
    let sqlQuery = "SELECT * FROM product WHERE stock_quantity < 5";

    connection.query(sqlQuery, function (err, response) {
      if (err) {
        console.log("Error displaying products: " + err);
        connection.end();
      } else {
        console.log("------------------------------");
        
        for (var i = 0; i < response.length; i++)
          console.log(response[i].product_id + " : " + response[i].product_name + " : " + response[i].department_id + " : " + response[i].stock_quantity + " : " + response[i].product_sales);       
        
        console.log("------------------------------");
        }
    });
};

function addToProductStock(){

  inquirer.prompt([
    {
      type: "input",
      message: " Which product do you wish to update ?",
      name: "productIdInput"
    },
    {
      type: "number",
      message: "What is the quantity to update the inventory with ?",
      name: "productQtyInput"
    }]).then(function(inquirerResponse) {

    console.log("Updating the product inventory quantities...\n");

    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantiy: inquirerResponse.productQtyInput
        },
        {
          product_id: inquirerResponse.productIdInput
        }
      ],
      function(err, res) {
        if (err) throw err;
          console.log(res.affectedRows + " products updated!\n");
        
        setTimeout(keepManaging,1000);
      }
    );

  });

};

function addNewProduct(){
    console.log("Inserting a new product in table...\n");

    inquirer.prompt([
      {
        type: "input",
        message: " Which product do you wish to create ?",
        name: "productNameInput"
      },{
        type: "number",
        message: "In which department will this product be sold ?",
        name: "departmentIdInput"
      },{
        type: "number",
        message: "How much of the qty do you wish to start inventory with ?",
        name: "productQtyInput"
      },
      {
        type: "number",
        message: "What is the suggested retail price ?",
        name: "priceInput"
      }]).then(function(inquirerResponse) {

        connection.query(
          "INSERT INTO product SET ? ", 
          { 
            product_name: inquirerResponse.productNameInput,
            department_id: parseInt(inquirerResponse.departmentIdInput),
            stock_quantity: parseInt(inquirerResponse.productQtyInput),
            price: parseFloat(inquirerResponse.priceInput).toFixed(2),
            product_sales: 0.00
          },
          function(err, res) {
          if (err) throw err;
            console.log(res);
            // connection.end();
          setTimeout(keepManaging,1000);
        });

        
      });                 
};

function promptManager(){
    inquirer.prompt([
        {
            type: "list",
            message: "Hello there Manager, which service would you like to use ?",
            name: "managerService",
            choices: ['View Product Catalogue','Add Product to Catalogue','Add Product Stock','View Low Inventory']
        }]).then(function(inquirerResponse) {
            
            switch(inquirerResponse.managerService){
                case 'View Product Catalogue':
                    viewProductCatalogue();
                    setTimeout(keepManaging,1000);
                    break;
                case 'Add Product to Catalogue':
                    viewProductCatalogue();
                    addNewProduct();
                    break;
                case 'Add Product Stock':
                    addToProductStock();
                    setTimeout(keepManaging,1000);
                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    setTimeout(keepManaging,1000);
                    break;
            } 
        }); 
};

function keepManaging(){
  inquirer.prompt([
    {
      type: "confirm",
      message: "Keep managing ?",
      name: "manageService"
    }]).then(function(inquirerResponse){
    
    if(inquirerResponse.manageService)
      promptManager();
    else
      process.exit();
    });
};

promptManager();