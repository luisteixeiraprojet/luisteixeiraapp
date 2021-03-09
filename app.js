const express = require('express');
const cors = require('cors');
const app = express();

//Cors Problem
app.use(cors());

//token
const jwt = require("jsonwebtoken");



//Modules
const employees = require('./routes/employees');
const allTables = require('./models/tablesDB');
const login = require('./routes/logIn');
const absences = require('./routes/absences');
const employeeDAO = require('./controlleur/employeeDataFunctions');
const dotenv = require("dotenv").config();
const auth = require('./controlleur/authenticationDataFunctions');
const timeSheets = require('./routes/timeSheets');
const activities = require('./routes/activities');
const materials = require('./routes/material');


//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', tokenMiddleWare, employees);  //path + router object: any routes started with /employees use the router object imported inside the module employees
app.use('/login', login);
app.use('/absences', tokenMiddleWare, absences);
app.use('/timesheets', tokenMiddleWare, timeSheets);
app.use('/activities', tokenMiddleWare, activities);
app.use('/materials',tokenMiddleWare,  materials);
 
//_________________________________________________________________________________________
//make sure that the token is still valide at each request
function tokenMiddleWare(req, res, next) {

  // Get the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  
  //verify first if the token exixts in the header
  //split 'cause of the 'bearer ' - seen in postman 
  let token = authHeader && authHeader.split(' ')[1]
  console.log("ver se  true or false ", token);

  if (token == null) return res.sendStatus(401) // if there isn't a token
 
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

    if (err) {
      return res.sendStatus(403)
    }else{
      req.user = user;

      let username = {a:user.username };
 
      let newToken = auth.generateAccessToken(username);
      
      //include the newToken inside res so it can be send to employees.js requests 
      res.token = newToken; 
    }
    next() // pour executer whatever request the client intend to
  })
} 
//_____________________________________________________________________________
//verify Token still valide 
app.get("/tokenVerify", tokenMiddleWare, async function (req, res) {
  console.log("GET: http://localhost:3000/tokenVerify");

  let tokenStillValide = {result: "OK"}; //its  {result: "OK"} so it will make parse, works with objects
 // res.send(tokenStillValide);
  res.send(auth.createResponse(tokenStillValide, res.token));
});

//______________________________________________________

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