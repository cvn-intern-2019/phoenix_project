// Set mysql_native_password first
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678'
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    // database: 'KahootDB'

});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE KahootDB", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});