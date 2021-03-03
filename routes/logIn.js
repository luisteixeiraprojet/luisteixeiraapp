// "yKFb3mV41G"

//Dependencies
const Joi = require("joi"); //used to validate inputs
const express = require("express");
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const authenticationDao = require("../controlleur/authenticationDataFunctions");


//LogIn
router.post("/", async function (req, res) {
  const { error } = validateLogIn(req.body); //desconstructure to get error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const employeeExists = await authenticationDao.employeeExists(req.body);
    res.send(employeeExists);
    
  } catch (error) {
    res.status(error.status || 500).send({"result": "ko", "error":error.message}); 
    console.log("error logIn ", error.message);
    return error;
  }
});

//____________________________________________
router.post("/newpassword", async function (req, res) {

 const { error } = validateNewPass(req.body); //desconstructure to get error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {

   await authenticationDao.userNameExists(req.body);
   
    res.send({"result": "ok"});

  } catch (error) {
    res.status(error.status || 500).send({"result": "ko", "error":error.message});
    console.log("Error ", error.message);
    return error;
  }
});

//____________________________________________________
//validate inputs Login
function validateLogIn(credentials) {
  const schema = Joi.object({
    userName: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(credentials);
}

//_____________________________________________________
function validateNewPass(email) {
  const schema = Joi.object({
    userName: Joi.string().email().required()
  });
  return schema.validate(email);
}





//export the router
module.exports = router;
