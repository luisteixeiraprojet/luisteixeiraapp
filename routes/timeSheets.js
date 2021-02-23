//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const timeSheetDAO = require('../controlleur/timeSheetDataFunctions');
const auth = require('../controlleur/authenticationDataFunctions'); 
const { allow } = require('joi');

//___________________________________________________________
//READ ALL
router.get('/', async (req, res) => {
 
  //get all timeSheets
  const allTimeSheets = await timeSheetDAO.getAllTimeSheets();
  
  //the client awaits a promise, so we need to send an object 

 res.send(auth.createResponse(allTimeSheets, res.token));
  //Add error sent in case of bad connection to the DB??
}); 

//______________________________________________________
//GET BY Absnece ID
/*
router.get('/:id', async (req, res) => {
    console.log("getById : http://localhost:3000/absences/1");

    //verify absence existance searching it by his id
    const absenceExists = await absenceDAO.getAbsenceById(parseInt(req.params.id)); //false ou employee
    if(!absenceExists) {
      res.status(404).send("Cet absence n'existe pas"); 
      return;
    }  
    
    res.send(absenceExists);
  });
*/

/*
//GET BY Employee ID
router.get('/myAbsences/:idEmployee', async (req, res) => {
let idEmpl = parseInt(req.params.idEmployee);
const myAbsences = await absenceDAO.getMyAbsences(idEmpl);
res.send(auth.createResponse(myAbsences, res.token));
});
*/


//_______________________________________________________
//CREATE 
router.post('/', async (req, res) => {
   
      //validate inputs (JOi)
      const {error} = validateTimeSheet(req.body); //desconstructure to get error
      if(error){
      res.status(400).send(error.details[0].message);
      return;
      } 
    const createdTS = await timeSheetDAO.createTimeSheet(req.body);
    res.send(auth.createResponse(createdTS, res.token));
}); 


//________________________________________________________
//UPDATE  
/* 
router.put('/absenceUpdate', async (req, res) => {
  
    //1. validate changed inputs
    const {error} = validateAbsence(req.body); //deconstructure to get error
    if(error) {
      console.log("UPDATE error " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } 
    // 2. DB search absence by its id
   let absenceToChange;
    try {
      absenceToChange = await absenceDAO.updateAbsence(req.body); //false ou employee
    } catch (error) {
      return error.message;
    }
    if(!absenceToChange) {
      res.status(404).send("1.2. Cet absence n'existe pas");
    return;
  }
    res.send(auth.createResponse(absenceToChange, res.token));
  })
*/
//____________________________________________________________
//DELETE
/*
router.delete('/:id', async function (req, res) {
    //Id to search it in DB
   
    const id = parseInt(req.params.id);

    //delete
    const deletedAbsence = await absenceDAO.deleteAbsence(id);
    res.send(auth.createResponse(deletedAbsence, res.token)); //maybe return the list without the one deleted?
});
*/
//___________________________________________________________

function validateTimeSheet(theTS){
  const schema = Joi.object({
    Id_timeSheet : Joi.number(),
    startAt    : Joi.date().iso().required(),
    finishAt   : Joi.date().iso().required(),
    totalHours  :Joi.number().required(),
    priceHour  : Joi.number().required(),
    Id_activity: Joi.number().allow(null, ''),
    Id_employee : Joi.number().required()
  });
  return schema.validate(theTS);
}


//export the router
module.exports = router;