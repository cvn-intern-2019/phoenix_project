const mysql = require('mysql');
const md5 = require('md5');
//Database
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

class User {
    constructor() {

    }

    createUser(username,password,email) {
        let insertQuery = `INSERT INTO users (user_username,user_password,user_email) values ('${username}','${password}','${email}')`
        con.query(insertQuery, (err, result) => {
            if (err) throw err;
            return result[0];
        })
    }


}

