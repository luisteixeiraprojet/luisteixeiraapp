const express = require('express');
const app = express();


//Modules
const employees = require('./routes/employees');



//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', employees);  //path + router object: any routes started with /users use the router object imported inside the module users

app.get('/', (req, res) => {
  console.log("get: http://localhost:3000/");
  //get all employees
 
  res.send("OK");
});

//conexao DB
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();



//Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})