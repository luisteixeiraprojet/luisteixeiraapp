//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const absenceDAO = require('../controlleur/absenceDataFunctions');
const auth = require('../controlleur/authenticationDataFunctions'); 
//READ ALL
router.get('/', async (req, res) => {
   // console.log("++++++ 4.GET: http://localhost:3000/absences");
   
   // console.log("+++++ 4.1 agora vai p getAllAbsences de absenceDAataFunction")
  //get all absences
  const allAbsences = await absenceDAO.getAllAbsences();
  
 // console.log("fim get absences route send: allAbsences ", allAbsences);
  //the client awaits a promise, so we need to send an object 
  res.send(auth.createResponse(allAbsences, res.token));
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
    console.log("///////////1. POST: http://localhost:3000/absences");
  console.log("/////////////1.1.chamou post de create absence");
      //validate inputs (JOi)
      console.log("//////// 1.2.o que é enviado no body ", req.body);
      const {error} = validateAbsence(req.body); //desconstructure to get error
    
      if(error){
        console.log("////////1.3.dentro if se erro do post");
        console.log( "erro no serveur em post de route absence ", error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
      } 
      console.log("///// 1.4.vai chamar a createAbsence de absenceDAO")
    const createdAbsence = await absenceDAO.createAbsence(req.body);
    console.log("/////////1.5. resultado de createdAbsence-routes absences ", createdAbsence);
    res.send(auth.createResponse(createdAbsence, res.token));
}); 

//________________________________________________________
//UPDATE   
router.put('/:id', async (req, res) => {
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