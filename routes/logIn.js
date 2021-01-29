//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const authenticationDao = require('../controlleur/authenticationDataFunctions.js');


//export the router
module.exports = router;