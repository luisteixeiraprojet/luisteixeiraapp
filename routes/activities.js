//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const activityDAO = require('../controlleur/activityDataFunctions');
const auth = require('../controlleur/authenticationDataFunctions'); 

//READ ALL

router.get('/', async (req, res) => {
 
  //get allactivities 
  const allActivities = await activityDAO.getAllActivities();

  //the client awaits a promise, so we need to send an object 
  res.send(auth.createResponse(allActivities, res.token));
  //res.send(allActivities);
  //Add error sent in case of bad connection to the DB??
}); 
//______________________________________________________
//GET BY Absnece ID

router.get('/:id', async (req, res) => {
    console.log("getById : http://localhost:3000/activities/1");

    //verify absence existance searching it by his id
    const activityExists = await activityDAO.getActivityById(parseInt(req.params.id)); //false ou employee
    if(!activityExists) {
      res.status(404).send("Cet activité n'existe pas"); 
      return;
    }  
    res.send(auth.createResponse(activityExists, res.token));
    //res.send(activityExists);
  });


//GET BY Employee ID
/*
router.get('/myAbsences/:idEmployee', async (req, res) => {
let idEmpl = parseInt(req.params.idEmployee);
const myAbsences = await absenceDAO.getMyAbsences(idEmpl);
res.send(auth.createResponse(myAbsences, res.token));
});*/



//_______________________________________________________
//CREATE 
router.post('/', async (req, res) => {
   
      //validate inputs (JOi)
      const {error} = validateActivity(req.body); //desconstructure to get error
      if(error){
      res.status(400).send(error.details[0].message);
      return;
      } 
    const createdActivity = await activityDAO.createActivity(req.body);
    
   res.send(auth.createResponse(createdActivity, res.token));
   // res.send(createdActivity); // para usar sem pedir tokenVerification in app.js 
}); 

//________________________________________________________
//UPDATE   

router.put('/activityUpdate', async (req, res) => {
  
  console.log("updateActivity :http://localhost:3000/activities/activityUpdate")
    //1. validate changed inputs
   
    const {error} = validateActivity(req.body); //deconstructure to get error
    if(error) {

      console.log("UPDATE error " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } 
    // 2. DB search absence by its id
   let actvtToChange;
    try {
      actvtToChange = await activityDAO.updateActivity(req.body); //false ou employee
    } catch (error) {
      return error.message;
    }
    if(!actvtToChange) {
      res.status(404).send("Cet activity n'existe pas");
    return;
  }
   res.send(auth.createResponse(actvtToChange, res.token));
  });

//____________________________________________________________
//DELETE

router.delete('/:id', async function (req, res) {
    //Id to search it in DB
    const id = parseInt(req.params.id);
    //delete
    const deleteActivity = await activityDAO.deleteActivity(id);
    res.send(auth.createResponse(deleteActivity, res.token));
});
//___________________________________________________________

function validateActivity(theActivity){
  const schema = Joi.object({
    Id_activity       : Joi.number(),
    name              : Joi.string().required(),
    startDate         : Joi.date().iso().allow(null, ''),
    endDate           : Joi.date().iso().allow(null, ''),
  });
  return schema.validate(theActivity);
}

//export the router
module.exports = router;