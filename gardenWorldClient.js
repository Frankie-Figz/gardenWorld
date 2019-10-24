var inquirer = require('Inquirer');
var mysql = require('mysql');
require("dotenv").config();

// Adding the keys import class
var keys = require("./keys.js");

// Global variable used to return the qty on hand
var currentQtyProduct = 0;
var inquirerProducyQty = 0;
var currentProductID = 0;
var currentPriceProduct = 0;

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

function createChoicesArray(a){
    let arrayID = [];
    for(var i in a)
        arrayID.push(a[i].product_id);
    console.log(arrayID);
    return arrayID;
};

function queryProductStock(id){
    let sqlQueryCurrentQty = "SELECT stock_quantity, price FROM product WHERE product_id = " + id;

    connection.query(sqlQueryCurrentQty, function(err, response) {
        if(err){
            console.log("Error displaying products: " + err);
            // connection.end();
        } else {
            console.log("I am here trying to stock it !");
            currentQtyProduct = response[0].stock_quantity;
            currentPriceProduct = response[0].price;
            console.log("------------------------------");
            // connection.end();
        }
    });
}

function consumeProduct(id,qty){
    // Obtains product stock
    console.log("Inside the consume statement : " + currentQtyProduct);

    // Consumes the product existences
    currentQtyProduct = parseInt(currentQtyProduct) - parseInt(qty);

    console.log("Current Qty Product : " + currentQtyProduct);
    console.log("Product ID : " + id);

    // Forms sql query to update product
    let sqlQueryUpdateQty = "UPDATE product SET stock_quantity = ?, product_sales = product_sales + ? WHERE product_id = ?";

    // Consumes the query and hopefully updates the product qty
    connection.query(sqlQueryUpdateQty, [currentQtyProduct,currentPriceProduct*inquirerProducyQty,id] ,function(err,response){
        if(err){
            console.log(" Error with product update: " + err);
        } else {
            console.log("----------------UPDATE COMPLETE " + currentQtyProduct + " units -------------");
        }
    });
    // connection.end();

};

function compareProductQty(){
    if(inquirerProducyQty > currentQtyProduct)
        console.log("Not enough product qty on hand ! " + "The requested " + inquirerProducyQty + "units is more than current stock of " + currentQtyProduct + " units !");
    else
        consumeProduct(currentProductID,inquirerProducyQty);
};

function viewProducts() {
    let sqlQuery = "SELECT * FROM product";
    connection.query(sqlQuery, function (err, response) {
      if (err) {
        console.log("Error displaying products: " + err);
        connection.end();
      } else {
        console.log("------------------------------");
        console.log(createChoicesArray(response));

        for (var i = 0; i < response.length; i++)
          console.log(response[i].product_id + " : " + response[i].product_name + ", " + response[i].price + " , " + response[i].department_id + ", " + response[i].stock_quantity + ", " + response[i].product_sales);
        
        console.log("------------------------------");

        inquirer.prompt([
            {
                type: "list",
                message: "Which product would you like to purchase ?",
                name: "itemDB",
                choices: createChoicesArray(response)},
            {
                type: "input",
                message: "How much qty of the product would you like to buy ?",
                name: "productQty"
            }]).then(function(inquirerResponse) {
                inquirerProducyQty = inquirerResponse.productQty;
                currentProductID = inquirerResponse.itemDB;
                // This function updates the qty on the hand (set as a global variable) for the item selected
                queryProductStock(inquirerResponse.itemDB);

                // Once the product stock quantity have been 
                setTimeout(compareProductQty,1000);

                // Re-prompts the user for the products on the inventory list
                setTimeout(viewProducts,1500);
                });
                
        console.log("------------------------------");        
      }
    });
  };

viewProducts();