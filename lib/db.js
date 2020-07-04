const master = require('../password')
const mysql = require('mysql');
const db = mysql.createConnection({
  host     : master.host,
  user     : master.user,
  password : master.password,
  database : master.database
});
db.connect();

module.exports = db;