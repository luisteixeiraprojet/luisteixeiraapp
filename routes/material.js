//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import  Modules
const materialDAO = require('../controlleur/materialDataFunctions');
const auth = require('../controlleur/authenticationDataFunctions'); 

//READ ALL

router.get('/', async (req, res) => {
 
  //get all absences 
  const allMaterials = await materialDAO.getAllMaterials();
  
  //the client awaits a promise, so we need to send an object 
  //res.send(allMaterials);
  res.send(auth.createResponse(allMaterials, res.token));
  //Add error sent in case of bad connection to the DB??
}); 

//______________________________________________________
//GET BY Absnece ID

router.get('/:id', async (req, res) => {
    console.log("getById : http://localhost:3000/materials/1");

    //verify absence existance searching it by his id
    const materialExists = await materialDAO.getMatById(parseInt(req.params.id)); //false ou employee
    if(!materialExists) {
      res.status(404).send("Cet absence n'existe pas"); 
      return;
    }  
    res.send(auth.createResponse(materialExists, res.token));
    //res.send(materialExists);
  });

//___________________________________________________
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
      const {error} = validateMaterial(req.body); //desconstructure to get error
      if(error){
      res.status(400).send(error.details[0].message);
      return;
      } 
    const createdMaterial = await materialDAO.createMaterial(req.body);
    //res.send(createdMaterial);
   res.send(auth.createResponse(createdMaterial, res.token));
}); 

//________________________________________________________
//UPDATE   

router.put('/materialUpdate', async (req, res) => {
  
    //1. validate changed inputs
    const {error} = validateMaterial(req.body); //deconstructure to get error
    if(error) {
      console.log("UPDATE error " + error.details[0].message);
      res.status(400).send(error.details[0].message);
      return;
    } 
    // 2. DB search absence by its id
   let materialToChange;
    try {
      materialToChange = await materialDAO.updateMaterial(req.body); //false ou employee
    } catch (error) {
      return error.message;
    }
    if(!materialToChange) {
      res.status(404).send("1.2. Cet absence n'existe pas");
    return;
  }
    //res.send(materialToChange);
    res.send(auth.createResponse(materialToChange, res.token));
  })

//____________________________________________________________
//DELETE

router.delete('/:id', async function (req, res) {
    //Id to search it in DB
    const id = parseInt(req.params.id);

    //delete
    const deleteMaterial = await materialDAO.deleteMaterial(id);
    //res.send(deleteMaterial);
    res.send(auth.createResponse(deleteMaterial, res.token)); //maybe return the list without the one deleted?
});

//___________________________________________________________

function validateMaterial(theMaterial){
  const schema = Joi.object({
    Id_material       : Joi.number(),
    purchaseDate      : Joi.date().iso().required(),
    name              : Joi.string().required(),
    quantity          : Joi.number().required(),
    unitaryPrice      : Joi.number().required(),
    supplier          : Joi.string().allow(null, ''),
    activities        : Joi.array().allow(null,'')
  });
  return schema.validate(theMaterial);
}


//export the router
module.exports = router;