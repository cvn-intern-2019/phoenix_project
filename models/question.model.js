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
    findByQuestionsetId: (qs_id) => {
        let sql = `SELECT * FROM kahootdb.questions WHERE questionset_id = ${qs_id}`;
        return db.query(sql);
    },
    add: (question, filename, qs_id) => {
        let sql = `INSERT INTO questions (question_content,question_answer1,question_answer2,question_answer3,question_answer4,question_answercorrect,question_image,questionset_id) 
        VALUES ("${question.content}","${question.answer1}","${question.answer2}","${question.answer3}","${question.answer4}","${question.correctanswer}","${filename}","${qs_id}")`;
        return db.query(sql);
    },
    getImageById: (q_id) => {
        let sql = `SELECT question_image FROM kahootdb.questions WHERE question_id = ${q_id}`;
        return db.query(sql);
    },
    delete: (q_id) => {
        let sql = `DELETE FROM kahootdb.questions WHERE question_id = ${q_id};`
        return db.query(sql);
    },
    listByQuestionSetId: (q_id, qs_id) => {
        let sql = `SELECT * FROM questions WHERE question_id = ${q_id} AND questionset_id = ${qs_id}`;
        return db.query(sql);
    },
    update: (question, filename, q_id) => {
        let sql = `UPDATE questions 
        SET question_content = '${question.content}',question_answer1 = '${question.answer1}',question_answer2 = '${question.answer2}',
            question_answer3 = '${question.answer3}',question_answer4 = '${question.answer4}',question_answercorrect = '${question.correctanswer}',question_image = '${filename}'  
        WHERE question_id = ${q_id};`
        return db.query(sql);
    },
};