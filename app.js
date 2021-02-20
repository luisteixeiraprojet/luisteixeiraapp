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

//Middlewears - if a path is not defined by default it will be used in all of them 
app.use(express.json()); //so we can hadle objects, ex. create a new user (always above the app.use modules)
app.use('/employees', tokenMiddleWare, employees);  //path + router object: any routes started with /employees use the router object imported inside the module employees
app.use('/login', login);
app.use('/absences', tokenMiddleWare, absences);


//_________________________________________________________________________________________
//make sure that the token is still valide at each request
function tokenMiddleWare(req, res, next) {
 // console.log("1.---------testemiddleware", req.body);

  // Get the jwt access token from the request header
  const authHeader = req.headers['authorization'];
 // console.log("2.--------os authHeaders sao: ", JSON.stringify(authHeader));
  
  //verify first if the token exixts in the header
  //split 'cause of the 'bearer ' - seen in postman 
  let token = authHeader && authHeader.split(' ')[1]
//  console.log("---------------3.o token passado do angular e  com split ", token);
  if (token == null) return res.sendStatus(401) // if there isn't a token
  
 
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //  console.log("4.---------ver se é igual ao novo token ", token);
  //  console.log("5.---------Ha erro? linha 42 app.js", err)
    if (err) {
      return res.sendStatus(403)
    }else{
      req.user = user;
   //   console.log("------------ 6.req.user é ", req.user);
      
      let username = {a:user.username };
     // console.log("------------7. o username objeto é ", username)
      let newToken = auth.generateAccessToken(username);
      
     // console.log("------------8. newToken antes do res.Send", newToken);
      //include the newToken inside res so it can be send to employees.js requests 
      res.token = newToken; 
      //console.log("-------------9.app.js linha61  res.token é igual ao anterior? ", res.token);
    }
   
    next() // execute whatever request the client intended to
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