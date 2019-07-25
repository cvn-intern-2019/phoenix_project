var db = require('../../utils/db');

module.exports = {
    all: () => {
        return db.query('select * from questionsets');
    },

    add: entity => {
        return db.add('questionsets', entity);
      }
};