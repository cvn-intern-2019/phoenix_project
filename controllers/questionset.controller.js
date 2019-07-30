const questionset_model = require('../models/questionset.model');
var multer = require('multer');
var fs = require('fs');

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
    showQuestionsetList: (req, res) => {
        questionset_model.list(req.user.user_id)
            .then(result => {
                res.render('questionsets/questionset', {
                    user: req.user,
                    questionset: result
                });
            }).catch(err => {
                console.log(err);
            })
    },

    addquestionset: (req, res) => {
        res.render('questionsets/add_questionset', { user: req.user, csrfToken: req.csrfToken() });
    },

    savequestionset: (req, res) => {
        let questionset = req.body;
        upload(req, res, err => {
            if (err) {
                res.render('questionsets/add_questionset');
            } else {
                var filename = "";
                if (req.file) {
                    filename = req.file.filename;
                }
                questionset_model.save(questionset, filename)
                    .then(result => {
                        questionset_model.questionsetByUser(req.user.user_id, result.insertId)
                            .then(result => {
                                res.redirect('/host/questionset');
                            })
                            .catch(err =>{
                                res.render('questionsets/add_questionset');
                            });
                    })
                    .catch(err => {
                        res.render('questionsets/add_questionset');
                    });
            }
        })
    },
    findquestionset: (req, res) => {
        questionset_model.findById(req.params.qs_id)
            .then(result => {
                let path = '/img/' + result[0].questionset_image;
                res.render('questionsets/edit_questionset', { questionset: result[0], path: path, csrfToken: req.csrfToken() });
            })
            .catch(err => {
                res.redirect('/host/questionset');
            });
    },

    editquestionset: (req, res) => {
        let questionset = req.body;
        upload(req, res, err => {
            if (err) {
                res.render('questionset/questionset');
            } else {
                var fileName = "";
                if (req.file) {
                    fileName = req.file.filename;
                    try {
                        fs.unlink('./public/img/' + questionset.image, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            //file removed
                        })
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    fileName= questionset.image;
                }
                questionset_model.update(questionset, fileName, req.params.qs_id)
                    .then(result => {
                        res.redirect('/host/questionset');
                    })
                    .catch(err => {
                        res.render('questionsets/add_questionset');
                    });
            }
        })
    },


    create_room: (req, res) => {
        questionset_model.checkValidQuestionSet(req.params.qs_id, req.user.user_id)
            .then(result => {
                if (result[0]) {
                    res.render('waiting_room', { questionsets: result, csrfToken: req.csrfToken() });
                } else {
                    res.redirect('/host/questionset');
                }
            })
            .catch(err => {
                res.redirect('/host/questionset');
            });
    },
};