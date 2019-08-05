var db = require('../utils/db');

function format(str) {
    str = str.replace(/"/gi, `\\"`);
    str = str.replace(/'/gi, `\\'`);
    return str;
}

module.exports = {
    format,
    exec: query => {
        return db.query(query);
    },

    list: (user_id) => {
        let sql = `SELECT questionsets.* FROM questionsets, user_questionset 
        WHERE user_questionset.questionset_id = questionsets.questionset_id and user_questionset.user_id = ${user_id}`;
        return db.query(sql);
    },

    save: (questionset, filename) => {
        let sql = `INSERT INTO questionsets (questionset_title,questionset_description,questionset_image,questionset_state) 
        VALUES ("${questionset.title}","${questionset.description}","${filename}","${questionset.status}")`;
        return db.query(sql);
    },

    findById: (qs_id) => {
        let sql = `SELECT * FROM questionsets WHERE questionset_id = '${qs_id}'`;
        return db.query(sql);
    },

    getImage: (qs_id) => {
        let sql = `SELECT questionset_image FROM questionsets WHERE questionset_id = ${qs_id}`;
        return db.query(sql);
    },

    update: (questionset, filename, qs_id) => {
        let sql = `UPDATE questionsets 
        SET questionset_title = '${questionset.title}',questionset_description = '${questionset.description}',questionset_image = '${filename}',questionset_state = '${questionset.status}'  
        WHERE questionset_id = '${qs_id}';`;
        return db.query(sql);
    },

    questionsetByUser: (user_id, questionset_id) => {
        let sql = `INSERT INTO user_questionset (user_id, questionset_id) VALUES ("${user_id}","${questionset_id}")`;
        return db.query(sql);
    },

    checkValidQuestionSet: (qs_id, user_id) => {
        let sql = `SELECT questionsets.* FROM questionsets, user_questionset 
        WHERE user_questionset.questionset_id = questionsets.questionset_id 
        and questionsets.questionset_id = ${qs_id} and user_questionset.user_id = ${user_id}`;
        return db.query(sql);
    },

};