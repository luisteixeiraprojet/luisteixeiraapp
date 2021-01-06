const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
  user: 'sxfwfgg05lgz8lfg',
  password:	'u5mxb6wi4kkxb8id',
  database: 'kfgv7183lcyrjg63',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


//export
module.exports = pool;