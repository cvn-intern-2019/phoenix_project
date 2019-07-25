var db = require('../../utils/db');

module.exports = {
    all: () => {
        return db.query('select * from questionsets');
    }
};