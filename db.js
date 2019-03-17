var mysql = require('mysql')
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port:process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
})


connection.connect();

connection.query('SELECT 1+1 AS solution',function (error,result,fields) {

   if(error) throw error;
   console.log("Connected to DB Successfully db.js");

    });

module.exports = connection;