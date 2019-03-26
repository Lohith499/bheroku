var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'lohith499',
  port:3306,
  password: 'lohith499',
  database : 'express'
})


connection.connect();

connection.query('SELECT 1+1 AS solution',function (error,result,fields) {

   if(error) throw error;
   console.log("Connected to DB Successfully db.js");

    });

module.exports = connection;