//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const employeeDAO = require('../controlleur/employeeDataFunctions');



//CRUD Employees // API - interface
//get employee by id 
router.get('/:id', async (req, res) => {
    console.log("getById : http://localhost:3000/employees/1");

    //verify employee existance searching him by his id
    const employeeExists = await employeeDAO.getEmployeeById(parseInt(req.params.id)); //false ou employee
    if(!employeeExists) {
      res.status(404).send("Cet utilisateur n'existe pas"); 
      return;
    }  
    res.send(employeeExists.safeUserDetailed());
  });

 
//READ - get all
//async because there's a promisse
router.get('/', async (req, res) => {
    console.log("get: http://localhost:3000/employees");
    //get all employees
    const allEmployees = await employeeDAO.getAllEmployees();
    res.send(allEmployees);
    //Add error sent in case of bad connection to the DB??
  });  

//CREATE
router.post('/', async function (req, res) {
    console.log("post no servidor: http://localhost:3000/employees");
    //validate inputs (JOi)
    const {error} = validateEmployee(req.body); //desconstructure to get error
    
    if(error){
    res.status(400).send(error.details[0].message);
    return;
    } 
    const createdEmployee = await employeeDAO.createEmployee(req.body);
    res.send(createdEmployee);
  });

//UPDATE
router.put('/formUpdate/:id', async (req, res) => {
  console.log("UPDATE de routes employees chamada pelo employee.Service");
    console.log("UPDATE de routes employees put: http://localhost:3000/employees//formUpdate/" + parseInt(req.params.id));
 //1. validate changed inputs
   const {error} = validateEmployee(req.body); //deconstructure to get error
    if(error) {
      console.log("UPDATE servidor employees route: deu no VALIDATE " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } 
    // 2. DB search employee by his id
    let employeeToChange;
    try {
      employeeToChange = await employeeDAO.updateEmployee(parseInt(req.params.id), req.body); //false ou employee
    } catch (error) {
      console.log("UPDATE routes employees : erro no searchById ")
      return error.message;
    }
    if(!employeeToChange) {
      res.status(404).send("Cet utilisateur n'existe pas");
    return;
  }
    console.log("o employeeToChange e: " + JSON.stringify(employeeToChange));
    res.send(employeeToChange);
  })

//DELETE 
router.delete('/:id', async function (req, res) {
    //Id to search it in DB
    const id = parseInt(req.params.id);
    console.log("delete: http://localhost:3000/employees/" + id);
    //delete
    const deletedEmployee = await employeeDAO.deleteEmployee(id);
    res.send(deletedEmployee); //maybe return the list without the one deleted?
});

//validate inputs employee - used for create and update employees
function validateEmployee(theEmployee){
  const schema = Joi.object({
    firstName        : Joi.string().min(2).required(),
    lastName         : Joi.string().min(2).required(),
    mobilePhone      : Joi.string().min(9).max(18).required(),
    homePhone        : Joi.string().min(9).max(18).allow(null, ''),
    email            : Joi.string().email().required(),
    address          : Joi.string().allow(null, ''),
    addressComplement: Joi.string().allow(null, ''),
    zipCode          : Joi.string().allow(null, ''),
    nationality      : Joi.string().allow(null, ''),
    identityNumber   : Joi.string().allow(null, ''),
    socialNumber     : Joi.string().allow(null, ''),
    birthdayDate     : Joi.date().iso().allow(null, ''),
    iban             : Joi.string().allow(null, ''),
    typeContract     : Joi.string().allow(null, ''),
    joinDate         : Joi.date().iso().allow(null, ''),
    hourlyPrice      : Joi.number().allow(null, ''),
    userName         : Joi.string().allow(null, ''),
    password         : Joi.string().allow(null, ''),
    sessionId        : Joi.string().allow(null, '')
  });
  return schema.validate(theEmployee);
}


//export the router
module.exports = router;
