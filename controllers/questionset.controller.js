const questionset_model = require('../models/questionset.model');
var db = require('../utils/db');
var multer = require('multer');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
}).single('questionset_img');

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
                res.render('error');
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
                            .catch(err => {
                                console.log(err);
                                res.render('error');
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('error');
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
                console.log(err);
                res.render('error');
            });
    },
    editquestionset: (req, res) => {
        questionset_model.getImage(req.params.qs_id)
            .then(result => {
                console.log(result);
                let fileName = result[0].questionset_image;
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
        let questionset = req.body;
        let path = './public/img/' + questionset.questionset_image;
        upload(req, res, err => {
            if (err) {
                res.render('questionset/questionset');
            } else {
                var filename = "";
                if (req.file) {
                    filename = req.file.filename;
                }
                questionset_model.update(questionset, filename, req.params.qs_id)
                    .then(result => {
                        res.redirect('/host/questionset');
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('error');
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
                console.log(err);
                res.render('error');
            });
    },
};