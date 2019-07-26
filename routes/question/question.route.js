var question = require('../../models/question/question.model')
var db = require('../../utils/db');

module.exports = function (app, upload) {
    app.route('/question/add')

    .get((req, res) => {
        res.render('question/create-question', { 
            user: req.user,
            csrfToken: req.csrfToken() 
        });
    })

    .post((req, res) => {
        let question = req.body;
        upload(req, res, err => {
            if (err) {
                res.send("Fail 1");
                // res.render('question/add_question'); 
            } else {
                var filename = "";
                if(req.file){
                    filename=req.file.filename;
                }
                var sql = `INSERT INTO questions (question_content,question_answer1,question_answer2,question_answer3,question_answer4,question_answercorrect,question_image,questionset_id) VALUES ("${question.content}","${question.answer1}","${question.answer2}","${question.answer3}","${question.answer4}","${question.correctanswer}","${filename}","${question.questionSetId}")`;
                db.query(sql)
                .then(result => {
                    res.send("created");
                    // res.redirect('/question'); 
                })
                .catch(err => {
                    res.send("Fail 2");
                    // res.render('question/create_question'); 
                });
            }
        })
    })
};