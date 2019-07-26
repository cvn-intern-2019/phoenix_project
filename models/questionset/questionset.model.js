var db = require('../../utils/db');

module.exports = {
    all: () => {
        return db.query('select * from questionsets');
    },

    single: id => {
        return db.query(`select * from questionsets where questionset_id = ${id}`);
    },

    add: user => {
        return db.query(`INSERT INTO questionsets (questionset_title,questionset_description,questionset_image,questionset_state) VALUES ("${user.title}","${user.description}","${user.file}","${user.status}")`);
    }
};