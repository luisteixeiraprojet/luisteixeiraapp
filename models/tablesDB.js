//Import other Modules
const connectionDB = require('../models/connectionDB');


//CREATE TABLE EMPLOYEES
function createTableEmployees(){

    let employeesTable = "CREATE TABLE `employees22222` ("  +
        "`id` INT(11) NOT NULL AUTO_INCREMENT," +
        "`joinDate` VARCHAR(50) NULL," +
        "`firstName` VARCHAR(50) NOT NULL," +
        "`lastName` VARCHAR(50) NOT NULL," +
        "`mobilePhone` VARCHAR(50) NOT NULL," +
        "`homePhone` VARCHAR(50) NULL," +
        "`email` VARCHAR(50) NULL," +
        "`address` VARCHAR(50) NULL," +
        "`addressComplement` VARCHAR(50) NULL," +
        "`zipCode` VARCHAR(50) NULL," +
        "`nationality` VARCHAR(50) NULL," +
        "`identityNumber` VARCHAR(50) NULL," +
        "`socialNumber` VARCHAR(50) NULL," +
        "`birthdayDate` VARCHAR(50) NULL," +
        "`age` VARCHAR(50) NULL," +
        "`iban` VARCHAR(50) NULL," +
        "`typeContract` VARCHAR(50) NULL," +
        "PRIMARY KEY (`id`) USING BTREE"  +
   " );"

//conexao DB


pool.query(employeesTable, function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

}

//export to be use par other modules
module.exports = createTableEmployees;