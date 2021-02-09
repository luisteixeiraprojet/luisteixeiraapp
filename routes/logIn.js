// "yKFb3mV41G"

//Dependencies
const Joi = require("joi"); //used to validate inputs
const express = require("express");
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const authenticationDao = require("../controlleur/authenticationDataFunctions");

//LogIn
router.post("/", async function (req, res) {
  console.log("post no servidor para login: http://localhost:3000/");
  //validate inputs (JOi)
  const { error } = validateLogIn(req.body); //desconstructure to get error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const employeeExists = await authenticationDao.employeeExists(req.body);
  console.log("------------------- login o employee exists: ", employeeExists);
  res.send(employeeExists);
});


//validate inputs
function validateLogIn(credentials) {
  const schema = Joi.object({
    userName: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(credentials);
}



/*
function verifyExistance(infos) {
  let employeeLogging = authenticationDao.employeeExists();
  console.log("funçao verifyExistance em logIn ", employeeLogging);
}
*/




//export the router
module.exports = router;
