//Dependencies 
const Joi = require('joi'); //used to validate inputs
const express = require('express');
const router = express.Router(); //the router that will be used in app.js

//Import other Modules
const authenticationDao = require('../controlleur/authenticationDataFunctions.js');

//LogIn
router.post('/logIn') {
    console.log("post no servidor: http://localhost:3000/logIn");
}
