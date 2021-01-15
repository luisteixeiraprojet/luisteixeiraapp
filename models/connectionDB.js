const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b962864968761c',
  password:	'd05f4344',
  database: 'heroku_dc3986e6fbc8d86',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


//export
module.exports = pool;