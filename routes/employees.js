//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const employeeDAO = require('../controlleur/employeeDataFunctions');
const tableEmployees = require('../models/tablesDB');


//CRUD Employees // API - interface
//get employee by id 
router.get('/:id', (req, res) => {
    console.log("getById : http://localhost:3000/employees/1");

    //verify employee existance searching him by his id
    const employeeExists = employeeDAO.getEmployeeById(parseInt(req.params.id)); //false ou employee
    if(!employeeExists) {
      res.status(404).send("Cet utilisateur n'existe pas"); 
      return;
    }  
    res.send(employeeExists);
  });

 
//READ
router.get('/', (req, res) => {
    console.log("get: http://localhost:3000/employees");
    //get all employees
    const allEmployees = employeeDAO.getAllEmployees();
    res.send(allEmployees);
    //Add error sent in case of bad connection to the DB
  });

//CREATE
router.post('/', function (req, res) {
    console.log("post: http://localhost:3000/employees");
    //validate inputs (JOi)
    const {error} = validateEmployee(req.body); //desconstructure to get error
    if(error){
    res.status(400).send(error.details[0].message);
    return;
    } 
    const createdEmployee = employeeDAO.createEmployee(req.body);
    res.send(createdEmployee);
  });

//UPDATE
router.put('/:id',  (req, res) => {
    console.log("put: http://localhost:3000/employees/" + parseInt(req.params.id));
 //1. validate changed inputs
   const {error} = validateEmployee(req.body); //deconstructure to get error
    if(error) {
      res.status(400).send(error.details[0].message);
      return;
    } 
    
    // 2. verify employee existance searching him by his id
    const employeeToChange = employeeDAO.updateEmployee(parseInt(req.params.id), req.body); //false ou employee
    if(!employeeToChange) {
      res.status(404).send("Cet utilisateur n'existe pas");
    return;
  }
    res.send(employeeToChange);
  })

//DELETE
router.delete('/:id', function (req, res) {
    console.log("delete: http://localhost:3000/employees/1");
    //Id to search it in DB
    const id = parseInt(req.params.id);
    //delete
    const deletedEmployee = employeeDAO.deleteEmployee(id);
    res.send(deletedEmployee);
});

//validate inputs employee - used for create and update employees
function validateEmployee(theEmployee){
  const schema = Joi.object({
    joinDate         : Joi.string().isoDate(),
    firstName        : Joi.string().min(2).required(),
    lastName         : Joi.string().min(2).required(),
    mobilePhone      : Joi.string().min(9).max(18).required(),
    homePhone        : Joi.string().min(9).max(18).allow(null, ''),
    email            : Joi.string().email().allow(null, ''),
    address          : Joi.string().allow(null, ''),
    addressComplement: Joi.string().allow(null, ''),
    zipCode          : Joi.string().allow(null, ''),
    nationality      : Joi.string().allow(null, ''),
    identityNumber   : Joi.string().allow(null, ''),
    socialNumber     : Joi.string().allow(null, ''),
    birthdayDate     : Joi.string().isoDate().allow(null, ''),
    age              : Joi.string().max(2).allow(null, ''),
    iban             : Joi.string().allow(null, ''),
    typeContract     : Joi.string().allow(null, '')
  });
  return schema.validate(theEmployee);
}

router.get('/createTable', function (req, res) {
  console.log("get: http://localhost:3000/employees/createTable");
  
  const creationEmployeesTable = tableEmployees.createTableEmployees();
  res.send(creationEmployeesTable);
});


//export the router
module.exports = router;
