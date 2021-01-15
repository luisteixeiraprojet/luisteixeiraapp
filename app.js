const express = require('express');
const app = express();

//to CORS Problem resolution - ANgular HTTP Service
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});


//Modules
const employees = require('./routes/employees');
const allTables = require('./models/tablesDB');



//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', employees);  //path + router object: any routes started with /users use the router object imported inside the module users



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