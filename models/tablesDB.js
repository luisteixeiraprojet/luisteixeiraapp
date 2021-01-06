


function createTableEmployees(){

    let employeesTable = "CREATE TABLE `employees` ("  +
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
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

connection.query(employeesTable, function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
}

//export to be use par other modules
module.exports = createTableEmployees;