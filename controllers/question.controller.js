const question_model = require('../models/question.model');
const questionset_model = require('../models/questionset.model');
const fs = require('fs');
const multer = require('multer');

var db = require('../utils/db');

const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
}).single('question_img');

module.exports = {
    showQuestionList: (req, res) => {
        let qs_id = req.params.id;
        let questionset_info_query = `SELECT * FROM kahootdb.questionsets WHERE questionset_id = ${qs_id}`;
        question_model.exec(questionset_info_query)
            .then(qs_info => {
                let question_list_query = `SELECT * FROM kahootdb.questions WHERE questionset_id = ${qs_id}`
                question_model.exec(question_list_query)
                    .then(q_list => {
                        res.render('questions/list', {
                            info_qs: qs_info[0],
                            list_q: q_list,
                            user: req.user,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('error');
                    });
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            });
    },
    addQuestion: (req, res) => {
        let qs_id = req.params.qs_id;
        res.render('questions/create-question', {
            qs_id: qs_id,
            user: req.user,
            // error: req.flash("addMessage"),
            csrfToken: req.csrfToken()
        });
    },
    saveQuestion: (req, res) => {
        let qs_id = req.params.qs_id;
        let question = req.body;
        upload(req, res, err => {
            if (err) {
                console.log("1");
                // req.flash("addMessage","Fail to create question!");
                // res.redirect(`/host/questionset/"${qs_id}"/question/add`); 
            } else {
                var filename = "";
                if (req.file) {
                    filename = req.file.filename;
                }
                var sql = `INSERT INTO questions (question_content,question_answer1,question_answer2,question_answer3,question_answer4,question_answercorrect,question_image,questionset_id) VALUES ("${question.content}","${question.answer1}","${question.answer2}","${question.answer3}","${question.answer4}","${question.correctanswer}","${filename}","${qs_id}")`;
                db.query(sql)
                    .then(result => {
                        res.redirect(`/host/questionset/"${qs_id}"/question`);
                    })
                    .catch(err => {
                        req.flash("addMessage", "Fail to insert question!");
                        res.redirect(`/host/questionset/${qs_id}/question/add`);
                    });
            }
        })
    },
    deleteQuestion: (req, res) => {
        // delete file
        let img_delete_query = `SELECT question_image FROM kahootdb.questions WHERE question_id = ${req.params.q_id}`;
        question_model.exec(img_delete_query)
            .then(result => {
                console.log(result);
                let fileName = result[0].question_image;
                try {
                    fs.unlink('./public/img/' + fileName, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        //file removed
                    })
                } catch (err) {
                    console.error(err)
                    res.render('error');
                }
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            });
        // delete db
        let question_delete_query = `DELETE FROM kahootdb.questions WHERE question_id = ${req.params.q_id};`
        question_model.exec(question_delete_query)
            .then(result => {
                console.log(result);
                res.redirect(`/host/questionset/${req.params.qs_id}/question`);
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            });
    },
    findQuestion: (req, res) => {
        let sql = `SELECT * FROM questions WHERE question_id = ${req.params.q_id} AND questionset_id = ${req.params.qs_id}`;
        question_model.exec(sql)
            .then(result => {
                if (result.length == 0) {
                    res.send('Question not found');
                }

                res.render('questions/update', {
                    csrfToken: req.csrfToken(),
                    question: result[0],
                    user: req.user
                })
            })
    },
    editQuestion: (req, res) => {
        let question = req.body;
        upload(req, res, err => {
            if (err) {
                console.log(err);
                res.render('error')
            } else {
                let filename = "";
                let sql = '';
                if (req.file) {
                    filename = req.file.filename;
                    try {
                        fs.unlink('./public/img/' + question.image, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            //file removed
                        })
                    } catch (err) {
                        console.error(err)
                    };

                    sql = `UPDATE questions SET question_content = '${question.content}',question_answer1 = '${question.answer1}',question_answer2 = '${question.answer2}',question_answer3 = '${question.answer3}',question_answer4 = '${question.answer4}',question_answercorrect = '${question.correctanswer}',question_image = '${filename}'  WHERE question_id = ${req.params.q_id};`
                } else {
                    sql = `UPDATE questions SET question_content = '${question.content}',question_answer1 = '${question.answer1}',question_answer2 = '${question.answer2}',question_answer3 = '${question.answer3}',question_answer4 = '${question.answer4}',question_answercorrect = '${question.correctanswer}'  WHERE question_id = ${req.params.q_id};`
                }

                question_model.exec(sql)
                    .then(result => {
                        res.redirect(`/host/questionset/${req.params.qs_id}/question`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
    }
};