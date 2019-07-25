// Set mysql_native_password first
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678'
const mysql = require('mysql');

var createConnection = () =>{
    return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'KahootDB'
    });
};



module.exports = {
    query: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
                connection.end();
            });
        });
    },

    add: (tableName, entity) => {
        return new Promise((resolve, reject) => {
          var sql = `insert into ${tableName} set ?`;
          var connection = createConnection();
          connection.connect();
          connection.query(sql, entity, (error, value) => {
            if (error) {
              reject(error);
            } else {
              resolve(value.insertId);
            }
            connection.end();
          });
        });
      },
};