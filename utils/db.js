// Set mysql_native_password first
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678'
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'KahootDB'

});

// module.exports = {
//     host: 'localhost',
//     user: 'root',
//     password: '12345678',
//     database: 'KahootDB'
// };


// connection.connect();

module.exports = {
    query: sql => {
        return new Promise((resolve, reject) => {
            // connection.connect();
            con.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
                // connection.end();
            });
        });
    },

};