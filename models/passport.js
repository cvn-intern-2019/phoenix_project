const localStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const md5 = require('md5');

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});