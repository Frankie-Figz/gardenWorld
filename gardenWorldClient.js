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

// initializing mysql connection
connection.connect(function(err){
    if(err) throw(err);
    console.log("===================== WELCOME TO GARDEN WORLD ! =====================");
    // run the start function which is where we will prompt the customer for the product they wish to purchase
    viewProducts();
});

// Function used to iterate over product ids which will later be displayed
function createChoicesArray(a){
    let arrayID = [];
    for(var i in a)
        arrayID.push(a[i].product_id);
    console.log(arrayID);
    return arrayID;
};

// Function used to extract the current qty and price attributes of a given product.
function queryProductStock(id){
    let sqlQueryCurrentQty = "SELECT stock_quantity, price FROM product WHERE product_id = " + id;

    connection.query(sqlQueryCurrentQty, function(err, response) {
        if(err){
            console.log("Error displaying products: " + err);
        } else {
            currentQtyProduct = response[0].stock_quantity;
            currentPriceProduct = response[0].price;
            console.log("------------------------------");
        }
    });
}

// 
function consumeProduct(id,qty){
    // The variable which will be used to consumee the product stock
    currentQtyProduct = parseInt(currentQtyProduct) - parseInt(qty);

    console.log("Current Qty Product : " + currentQtyProduct.toFixed(2));
    console.log("Product ID : " + id);
    console.log("Product Price is  : " + currentPriceProduct.toFixed(2));


    // Forms sql query to update product
    let sqlQueryUpdateQty = "UPDATE product SET stock_quantity = ?, product_sales = product_sales + ? WHERE product_id = ?";

    // Consumes the query and updates the product qty to the new inventory level after the customer sale
    connection.query(sqlQueryUpdateQty, [currentQtyProduct,currentPriceProduct*inquirerProducyQty,id] ,function(err,response){
        if(err){
            console.log(" Error with product update: " + err);
        } else {
            console.log("----------------UPDATE COMPLETE " + currentQtyProduct + " units -------------");
        }
    });
    // connection.end();

};

// This function compares the qty entered by the user to the stock of the product on hand
function compareProductQty(){
    if(inquirerProducyQty > currentQtyProduct)
        console.log("Not enough product qty on hand ! " + "The requested " + inquirerProducyQty + "units is more than current stock of " + currentQtyProduct + " units !");
    else{
        consumeProduct(currentProductID,inquirerProducyQty);
        console.log("Thank you for your purchase ! The total of your invoice is : $ "  + (inquirerProducyQty * currentPriceProduct).toFixed(2) );
        console.log("------------------------------");
    }
};

// The main function of the client. This ties together all the above functions and is also used to recurse over a confirm prompt.
function viewProducts() {
    // Query used to display the product catalogue alongside the quantity stock
    let sqlQuery = "SELECT * FROM product";
    connection.query(sqlQuery, function (err, response) {
      if (err) {
        console.log("Error displaying products: " + err);
        connection.end();
      } else {
        console.log("------------------------------");
        console.log(createChoicesArray(response));

        // Iterates over response and logs the table
        for (var i = 0; i < response.length; i++)
          console.log(response[i].product_id + " : " + response[i].product_name + ", " + response[i].price + " , " + response[i].department_id + ", " + response[i].stock_quantity + ", " + response[i].product_sales);
        
        console.log("------------------------------");

        inquirer.prompt([
            {
                type: "list",
                message: "Which product would you like to purchase ?",
                name: "itemDB",
                choices: createChoicesArray(response)
            },
            {
                type: "input",
                message: "How much qty of the product would you like to buy ?",
                name: "productQty",
                validate: function(input){
                    if (isNaN(input) == false) 
                    return true;
                else
                    return false;
                }
            }]).then(function(inquirerResponse) {
                inquirerProducyQty = inquirerResponse.productQty;
                currentProductID = inquirerResponse.itemDB;
                // This function updates the qty on the hand (set as a global variable) for the item selected. The timeout is used in order to deal with the asynchronous nature of node
                queryProductStock(inquirerResponse.itemDB);

                // Once the product stock quantity have been update then we can compare. The timeout is used in order to deal with the asynchronous nature of node
                setTimeout(compareProductQty,1000);

                // Re-prompts the user for the products on the inventory list. The timeout is used in order to deal with the asynchronous nature of node
                setTimeout(viewProducts,1500);
               
                });        
      }
    });
  };