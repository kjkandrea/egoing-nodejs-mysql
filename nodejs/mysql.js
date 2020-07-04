const mysql      = require('mysql');
const master   = require('../password')
const connection = mysql.createConnection({
  host     : master.host,
  user     : master.user,
  password : master.password,
  database : master.database
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', (error, results, fields) => {
  if (error) console.log(error);
  console.log(results);
});
 
connection.end();