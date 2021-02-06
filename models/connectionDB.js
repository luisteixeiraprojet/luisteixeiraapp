const mysql = require('mysql2/promise');


//go get the value of the variabels in .env
require('dotenv').config();


console.log("pool ", process.env.DB_HOST );
const pool = mysql.createPool({
 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:	process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


/*
const pool = mysql.createPool({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b962864968761c',
  password:	'd05f4344',
  database: 'heroku_dc3986e6fbc8d86',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});*/



//export
module.exports = pool;