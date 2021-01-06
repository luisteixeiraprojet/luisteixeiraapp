var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);

//export
module.exports = connection;