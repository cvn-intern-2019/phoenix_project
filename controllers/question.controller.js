const question_model = require('../models/question.model');
const questionset_model = require('../models/questionset.model');
const fs = require('fs');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
}).single('question_img');


module.exports = {
    showQuestionList: (req, res) => {
        let qs_id = req.params.qs_id;
        questionset_model.findById(qs_id)
            .then(qs_info => {
                question_model.findByQuestionsetId(qs_id)
                    .then(q_list => {
                        res.render('questions/list', {
                            info_qs: qs_info[0],
                            list_q: q_list,
                            user: req.user,
                            success: req.flash("success"),
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
            error: req.flash("error"),
            csrfToken: req.csrfToken()
        });
    },
    saveQuestion: (req, res) => {
        let qs_id = req.params.qs_id;
        let question = req.body;
        question.content = question_model.format(question.content);
        question.answer1 = question_model.format(question.answer1);
        question.answer2 = question_model.format(question.answer2);
        question.answer3 = question_model.format(question.answer3);
        question.answer4 = question_model.format(question.answer4);
        upload(req, res, err => {
            if (err) {
                req.flash("error","Fail to create question!");
                res.redirect(`/host/questionset/"${qs_id}"/question/add`); 
            } else {
                var filename = "";
                if(req.file){
                    filename=req.file.filename;
                }
                question_model.add(question,filename,qs_id)
                .then(result => {
                    req.flash("success","Create question successfully!");
                    res.redirect(`/host/questionset/"${qs_id}"/question`); 
                }).catch(err =>{
                    console.log(err);
                    req.flash("error","Fail to insert question!");
                    res.redirect(`/host/questionset/${qs_id}/question/add`); 
                });
            }
        })
    },
    deleteQuestion: (req, res) => {
        // delete file
        question_model.getImageById(req.params.q_id)
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
        question_model.delete(req.params.q_id)
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
        question_model.listByQuestionSetId(req.params.q_id,req.params.qs_id)
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
        question.content = question_model.format(question.content);
        question.answer1 = question_model.format(question.answer1);
        question.answer2 = question_model.format(question.answer2);
        question.answer3 = question_model.format(question.answer3);
        question.answer4 = question_model.format(question.answer4);
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

                } else {
                    filename = question.image;
                }
                question_model.update(question,filename,req.params.q_id)
                    .then(result => {
                        res.redirect(`/host/questionset/${req.params.qs_id}/question`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
    },

};