var db = require('../../utils/db');

module.exports = {
    all: () => {
        return db.query('select * from questions');
    },
    add: question => {
        return db.query(`INSERT INTO questions (question_content,question_answer1,question_answer2,question_answer3,question_answer4,question_answercorrect,question_image,questionset_id) VALUES ("${question.content}","${question.answer1}","${question.answer2}}","${question.answer3}","${question.answer4}","${question.correctanswer}","${question.image}","${question.questionSetId}")`);
    },
    update : question => {
        return db.query();
    }
};