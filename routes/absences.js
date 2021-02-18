//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const absenceDAO = require('../controlleur/absenceDataFunctions');
const auth = require('../controlleur/authenticationDataFunctions'); 
//READ ALL
router.get('/', async (req, res) => {
 
  //get all absences 
  const allAbsences = await absenceDAO.getAllAbsences();
  
  //the client awaits a promise, so we need to send an object 
  res.send(auth.createResponse(allAbsences, res.token));
  //Add error sent in case of bad connection to the DB??
}); 
//______________________________________________________
//GET BY Absnece ID
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

  //GET BY Employee ID

router.get('/myAbsences/:idEmployee', async (req, res) => {
let idEmpl = parseInt(req.params.idEmployee);
const myAbsences = await absenceDAO.getMyAbsences(idEmpl);
res.send(auth.createResponse(myAbsences, res.token));
});



//_______________________________________________________
//CREATE 
router.post('/', async (req, res) => {
   
      //validate inputs (JOi)
      const {error} = validateAbsence(req.body); //desconstructure to get error
      if(error){
      res.status(400).send(error.details[0].message);
      return;
      } 
    const createdAbsence = await absenceDAO.createAbsence(req.body);
    res.send(auth.createResponse(createdAbsence, res.token));
}); 

//________________________________________________________
//UPDATE   
router.put('/absenceUpdate/:id', async (req, res) => {
    console.log("UPDATE Put - routes: http://localhost:3000/absences//requestAbsence/" + parseInt(req.params.id));
 
    //1. validate changed inputs
 /*const {error} = validateAbsence(req.body); //deconstructure to get error
    if(error) {
      console.log("UPDATE servidor route: deu no VALIDATE " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } */
    // 2. DB search employee by his id
   let absenceToChange;
    try {
      absenceToChange = await absenceDAO.updateAbsence(parseInt(req.params.id), req.body); //false ou employee
    } catch (error) {
      return error.message;
    }
    if(!absenceToChange) {
      res.status(404).send("1.2. Cet absence n'existe pas");
    return;
  }
    res.send(absenceToChange);
  })

//____________________________________________________________
//DELETE
router.delete('/:id', async function (req, res) {
    //Id to search it in DB
   
    const id = parseInt(req.params.id);

    //delete
    const deletedAbsence = await absenceDAO.deleteAbsence(id);
    res.send(deletedAbsence); //maybe return the list without the one deleted?
});
//___________________________________________________________

function validateAbsence(theAbsence){
  const schema = Joi.object({
    justification    : Joi.string().allow(null, ''),
    typeOfAbsence    : Joi.string().required(),
    requestDate      : Joi.date().iso().required(),
    startDate        : Joi.date().iso().required(),
    endDate          : Joi.date().iso().required(),
    status           : Joi.string().allow(null, ''),
    statusDate       : Joi.date().iso().allow(null, ''),
    Id_employee      : Joi.number().required()
  
  });
  return schema.validate(theAbsence);
}


//export the router
module.exports = router;