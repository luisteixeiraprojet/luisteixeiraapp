//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const authenticationDao = require('../controlleur/authenticationDataFunctions.js');


//LogIn
router.post('/', async function (req, res)  {
    console.log("post no servidor para login: http://localhost:3000/");
    //validate inputs (JOi)
    const {error} = validateLogIn(req.body); //desconstructure to get error
    if(error){
    res.status(400).send(error.details[0].message);
    return;
    } 
       const employeeExists= await authenticationDao.verifyExistance(req.body);
        console.log("!!!!!!!!!!!!!!!!!!!! login o employee exists: " + employeeExists);
       res.send(employeeExists);
  });

//validate inputs 
function validateLogIn(credentials){
    const schema = Joi.object({
      identifiant      : Joi.string().email().required(),
      password         : Joi.string().min(10).max(10).required(),
    });
    return schema.validate(credentials);
  }


  function verifyExistance(infos){
    let employeeLogging = authenticationDao.emplyeeExists();
    console.log("funçao verifyExistance em logIn ", employeeLogging);
}
//export the router
module.exports = router;