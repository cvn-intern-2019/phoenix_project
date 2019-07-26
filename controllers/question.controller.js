const question_model = require('../models/question.model');
const questionset_model = require('../models/questionset.model');
const fs = require('fs');

module.exports = {
    showQuestionList: (req, res) => {
        let qs_id = req.params.id;
        let questionset_info_query = `SELECT * FROM kahootdb.questionsets WHERE questionset_id = ${qs_id}`;
        question_model.exec(questionset_info_query)
            .then(qs_info => {
                let question_list_query = `SELECT * FROM kahootdb.questions WHERE questionset = ${qs_id}`
                question_model.exec(question_list_query)
                    .then(q_list => {
                        res.render('questions/list', {
                            info_qs: qs_info[0],
                            list_q: q_list,
                            user: req.user
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
    }
};