const express = require('express');
const cors = require('cors');
const app = express();

//Cors Problem
app.use(cors());


//Modules
const employees = require('./routes/employees');
const allTables = require('./models/tablesDB');



//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', employees);  //path + router object: any routes started with /users use the router object imported inside the module users
app.use('/logIn', logIn);


app.get('/', (req, res) => {
  console.log("get: http://localhost:3000/");
  //get all employees
 
  res.send("OK");
});

//Create All Tables
app.get('/createTables', function (req, res) {
  console.log("get: http://localhost:3000/createTables");
  const creationTables = allTables.createTables();
  res.send(creationTables);
});

//Delete All Tables
app.get('/deleteTables', function (req, res) {
  console.log("get: http://localhost:3000/deleteTables");
  const deleteTables = allTables.deleteAllTables();
  res.send(deleteTables);
});



//Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})