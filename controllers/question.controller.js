const question_model = require('../models/question.model');
const questionset_model = require('../models/questionset.model');
const fs = require('fs');
const multer = require('multer');
const paginationSize = 5;

const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function(req, file, cb) {
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
                        let query = req.query;
                        let page_id = parseInt(query.page);
                        let page_count = q_list.length / paginationSize + 1;
                        let begin = (page_id - 1) * paginationSize;
                        let end = (page_id - 1) * paginationSize + paginationSize;
                        q_list = q_list.slice(begin, end);
                        res.render('questions/list', {
                            info_qs: qs_info[0],
                            list_q: q_list,
                            user: req.user,
                            success: req.flash("success"),
                            page_id,
                            page_count,
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
        question.content = question_model.format(question.content).trim();
        question.answer1 = question_model.format(question.answer1).trim();
        question.answer2 = question_model.format(question.answer2).trim();
        question.answer3 = question_model.format(question.answer3).trim();
        question.answer4 = question_model.format(question.answer4).trim();
        if (question.content.length <= 0 || question.answer1.length <= 0 || question.answer2.length <= 0 || question.answer3.length <= 0 || question.answer4.length <= 0) {
            req.flash("error", "Begin is not a space");
            res.render('questions/create-question', {
                qs_id: qs_id,
                user: req.user,
                error: req.flash("error"),
                csrfToken: req.csrfToken()
            });
        } else {
            upload(req, res, err => {
                if (err) {
                    req.flash("error", "Fail to create question!");
                    res.redirect(`/host/questionset/"${qs_id}"/question/add`);
                } else {
                    var filename = "";
                    if (req.file) {
                        filename = req.file.filename;
                    }
                    question_model.add(question, filename, qs_id)
                        .then(result => {
                            req.flash("success", "Create question successfully!");
                            res.redirect(`/host/questionset/${qs_id}/question?page=1`);
                        })
                        .catch(err => {
                            console.log(err);
                            req.flash("error", "Fail to insert question!");
                            res.redirect(`/host/questionset/${qs_id}/question/add`);
                        });
                }
            })
        }
    },
    deleteQuestion: (req, res) => {
        // delete file
        question_model.getImageById(req.params.q_id)
            .then(result => {
                let fileName = result[0].question_image;
                try {
                    fs.unlink('./public/img/' + fileName, (err) => {
                        if (err) {
                            console.error('Cannot find question image')
                            return;
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
                res.redirect(`/host/questionset/${req.params.qs_id}/question?page=1`);
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            });
    },
    findQuestion: (req, res) => {
        question_model.listByQuestionSetId(req.params.q_id, req.params.qs_id)
            .then(result => {
                if (result.length == 0) {
                    res.send('Question not found');
                }
                res.render('questions/update', {
                    csrfToken: req.csrfToken(),
                    error: req.flash("error"),
                    question: result[0],
                    user: req.user
                })
            })
    },
    editQuestion: (req, res) => {
        let qs_id = req.params.qs_id;
        let question = req.body;
        question.content = question_model.format(question.content).trim();
        question.answer1 = question_model.format(question.answer1).trim();
        question.answer2 = question_model.format(question.answer2).trim();
        question.answer3 = question_model.format(question.answer3).trim();
        question.answer4 = question_model.format(question.answer4).trim();
        if (question.content.length <= 0 || question.answer1.length <= 0 || question.answer2.length <= 0 || question.answer3.length <= 0 || question.answer4.length <= 0) {
            req.flash("error", "Begin is not a space");
            res.redirect('back');
        } else {
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
                            //file removed
                            fs.unlink('./public/img/' + question.image, (err) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            })
                        } catch (err) {
                            console.error(err)
                        };

                    } else {
                        filename = question.image;
                    }
                    question_model.update(question, filename, req.params.q_id)
                        .then(result => {
                            res.redirect(`/host/questionset/${req.params.qs_id}/question?page=1`);
                        })
                        .catch(err => {
                            console.log(err);
                            res.render('error');
                        });
                }
            })
        }
    },

};