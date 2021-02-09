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

const dotenv = require("dotenv").config();



//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', tokenMiddleWare, employees);  //path + router object: any routes started with /employees use the router object imported inside the module employees
app.use('/login', login);

//make sur thet the token is still valide at each request
function tokenMiddleWare(req, res, next) {
  console.log("testemiddleware", req.body);

  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  console.log("os authHeaders sao: ", JSON.stringify(authHeader));
 
  const token = authHeader && authHeader.split(' ')[1]
  console.log("o token com split ", token);
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // execute  whatever request the client intended to
  })
}

//____________________________________________________
//verify Token still valide 
app.get("/tokenVerify", tokenMiddleWare, async function (req, res) {
  console.log("GET: http://localhost:3000/tokenVerify");

  let tokenStillValide = {result: "OK"}; //its  {result: "OK"} so it will make parse, works with objects
  res.send(tokenStillValide);
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