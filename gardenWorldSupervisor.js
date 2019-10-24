var inquirer = require('Inquirer');
var mysql = require('mysql');
require("dotenv").config();

// Adding the keys import class
var keys = require("./keys.js");

// Information to pass to the connection manager
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

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    superviseMe();
  });
  
// Prompt the supervisor and later confirm if he would like to iterate through the supervisor menu
function superviseMe(){
    inquirer.prompt([
        {
            type: "list",
            message: "What action would you like to do today ?",
            name: "superviseChoices",
            choices: ["Create New Dept","Display Sales By Department"]
        }
    ]).then(function(inquirerResponse){
        switch(inquirerResponse.superviseChoices){
            case "Create New Dept":
                createNewDepartment();
                break;
            case "Display Sales By Department":
                viewProductSalesDepartment();
                break;
        }
    });
};

// Option that allows the supervisor to create a new department
function createNewDepartment(){
    inquirer.prompt([
        {
          type: "input",
          message: " Which department name do you wish to create ?",
          name: "departmentNameInput"
        },{
          type: "number",
          message: "What is the overhead cost of this department ?",
          name: "departmentOverheadCost"
        }]).then(function(inquirerResponse) {
  
          connection.query(
            "INSERT INTO department SET ? ", 
            { 
              department_name: inquirerResponse.productNameInput,
              over_head_costs: parseFloat(inquirerResponse.departmentOverheadCost).toFixed(2)
            },
            function(err, res) {
            if (err) throw err;
              console.log(res);
              // connection.end();
            setTimeout(superviseMe(),1000);
          });

        });        
};

// Option that allows the supervisor to create a new department
function viewProductSalesDepartment(){
    let sqlQuery = 
    "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) as department_product_costs, d.over_head_costs - SUM(p.product_sales) as total_profit " +  
    "FROM department d INNER JOIN product p ON p.department_id = d.department_id " + 
    "GROUP BY d.department_id, d.department_name";
    
    connection.query(sqlQuery,
        function(err, response) {
            if(err) throw response;
        console.log("------------------------------");  
        for (var i = 0; i < response.length; i++)
            console.log(response[i].department_id + " : " + response[i].department_name + ", " + response[i].over_head_costs + " , " + response[i].department_product_costs + ", " + response[i].total_profit);
          
        console.log("------------------------------");
        setTimeout(superviseMe(),1000);
      });    
};