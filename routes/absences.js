//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const absenceDAO = require('../controlleur/absenceDataFunctions');
 
//READ ALL
router.get('/', async (req, res) => {
    console.log("GET: http://localhost:3000/absences");
   
  //get all employees
  const allAbsences = await absenceDAO.getAllAbsences();
 
  //the client awaits a promise, so we need to send an object 
  res.send(allAbsences);
  //Add error sent in case of bad connection to the DB??
}); 
//______________________________________________________
//GETBYID
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


//_______________________________________________________
//CREATE 
router.post('/', async (req, res) => {
    console.log("POST: http://localhost:3000/absences");
    const createdAbsence = await absenceDAO.createAbsence(req.body);
    res.send(createdAbsence);
}); 

//________________________________________________________
//UPDATE   
router.put('/requestAbsence/:id', async (req, res) => {
    console.log("0. UPDATE Put - routes: http://localhost:3000/absences//requestAbsence/" + parseInt(req.params.id));
 
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
        console.log("1. Dentro do try ");
        absenceToChange = await absenceDAO.updateAbsence(parseInt(req.params.id), req.body); //false ou employee
        
    } catch (error) {
      console.log("1.1. Erro no try: : error searchById");
      return error.message;
    }
    if(!absenceToChange) {
      res.status(404).send("1.2. Cet absence n'existe pas");
    return;
  }
    console.log("1.3. a absence ToChange é: " + JSON.stringify(absenceToChange));
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




//export the router
module.exports = router;