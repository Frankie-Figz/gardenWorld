# Garden World
 Garden World is an online market place where our customers can purchase garden related products. On the backend of things, we have a team of managers and supervisors who through a handy set of high functions can monitor the business.

 The permissible functions available through the CLI are split up into the following modules :

<ul>
  <li> gardenWorldClient</li>
  <li> gardenWorldManager </li>
  <li> gardenWorldSupervisor </li>
</ul>

# Functionality
Documentation of the functionality can be found here :
<a href="https://drive.google.com/open?id=1iUoindp9V6U_S0BpibPPAcijsQ1FP1-b"> PDF</a>

## gardenWorldClient
  The Garden World Client module displays the product catalogue alongside the current stock per product. After displaying the catalogue it prompts the user to enter a product and the qty of the product that they wish to purchase.  <br>
  
  Their are a validation to assure that valid numbers are entered. Examples of invalid inputs that are registered would be 

## gardenWorldManager
  The Garden World Manager module is used to monitor the inventory levels and maintain the product catalogue. The functions available are :

<ul>
  <li> View Low Inventory</li>
  <li> Add Product to Catalogue </li>
  <li> Add Product Stock to Inventory </li>
  <li> View Product Catalogue </li>
</ul>
 
## gardenWorldSupervisor
  The functions in the supervisor module are below. The main functionality reflects the department costs based on the product sales (qty * price is added to product cost every time a sale is made).

  <ul>
  <li> Adding New Department</li>
  <li> Checking Department Costs </li>

 </ul>
 
# Technology Stack
The main language of this project is Javascript using mySQL as the database.

The Node libraries used for this project are the following.
<ul>
  <li> mysql </li>
    A library used to interface javascript and mysql.
  <li> dotenv </li>
    A library for hiding sensitive data from the code.
  <li> Inquirer </li>
    A library for prompting the user for input.
</ul>
