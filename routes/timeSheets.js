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
//GET BY  ID

router.get('/:id', async (req, res) => {
    console.log("getById : http://localhost:3000/timesheets/1");

    //verify absence existance searching it by his id
    const tSExists = await timeSheetDAO.getTSById(parseInt(req.params.id)); //false ou ts
    if(!tSExists) {
      res.status(404).send("Cet TimeSheet n'existe pas"); 
      return;
    }  
    
    res.send(tSExists);
  });

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

router.put('/tsUpdate', async (req, res) => {
 // console.log("****** 4. servidor::ts.routes- 69- dentro put/tsUpdate");
    //1. validate changed inputs
    const {error} = validateTimeSheet(req.body); //deconstructure to get error
    if(error) {
      console.log("UPDATE error " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } 
    // 2. DB search ts by its id
   let tsToChange;
    try {
     // console.log("****** 4.1 -80- dentro try do depois do caso erro put/tsUpdate");
     // console.log("****** 4.1.1 -80- req.body ", req.body);
      tsToChange = await timeSheetDAO.updateTS(req.body); //false ou employee
      console.log("****** 4.2. -82 - resultado de updateTs tsToChange ", tsToChange);
    } catch (error) {
      return error.message;
    }
    if(!tsToChange) {
      console.log("****** 4.3. -87 - dentro d if !tsToChange");
      res.status(404).send("1.2. Cet absence n'existe pas");
    return;
  }
  console.log("****** 4.5.- 91 -Fim funçao com tsToChange ", tsToChange);
    res.send(auth.createResponse(tsToChange, res.token));
  })

//____________________________________________________________
//DELETE

router.delete('/:id', async function (req, res) {
    //Id to search it in DB
   
    const id = parseInt(req.params.id);
    console.log('////// 3.. Route TimeSheet -102-delete c id  ', id );

    //delete
    const deletedTS = await timeSheetDAO.deleteTS(id);
    console.log('////// 3.1. Route TimeSheet -106- deletedTS  ', deletedTS);
    res.send(auth.createResponse(deletedTS, res.token)); //maybe return the list without the one deleted?
});

//___________________________________________________________

function validateTimeSheet(theTS){
  const schema = Joi.object({
    Id_timeSheet : Joi.number(),
    beginningDate : Joi.date().iso().required(),
    finishDate   : Joi.date().iso().required(),
    totalHours  :Joi.number().required(),
    priceHour  : Joi.number().required(),
    Id_activity: Joi.number().allow(null, ''),
    Id_employee : Joi.number().required()
  });
  return schema.validate(theTS);
}


//export the router
module.exports = router;