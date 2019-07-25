// Set mysql_native_password first
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678'
const mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'kahootdb'
    });
};

module.exports = {
    query: sql => {
        return new Promise((resolve, reject) => {
            con.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    },
};