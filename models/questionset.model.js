const db = require('../utils/db');

module.exports = {
   exec : query =>{
       return db.query(query);
   },
};