const questionset_model = require('../models/questionset.model');
const question_model = require('../models/question.model');
const { Game_rooms, Room } = require('../utils/game_room');
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
}).single('question_img');

module.exports = {
    showQuestionsetList: (req, res) => {
        var page = req.query.page || 1;
        let pageItems = 5;
        if (page < 1) page = 1;
        let min = 0;
        let max = 0;
        min = (page - 1) * pageItems;
        max = page * pageItems;
        questionset_model.list(req.user.user_id)
            .then(result => {
                let total = (result.length / pageItems) + 1;
                result = result.slice(min, max);
                res.render('questionsets/questionset', {
                    user: req.user,
                    questionset: result,
                    listPerPage: total,
                    page
                });
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            })
    },

    addquestionset: (req, res) => {
        res.render('questionsets/add_questionset', { user: req.user, error: req.flash("error"), csrfToken: req.csrfToken() });
    },

    savequestionset: (req, res) => {
        let questionset = req.body;
        questionset.title = questionset_model.format(questionset.title).trim();
        questionset.description = questionset_model.format(questionset.description).trim();
        upload(req, res, err => {
            if (questionset.title.length <= 0 ||questionset.description.length <= 0 ) {
                req.flash("error", "Begin is not a space");
                res.render('questionsets/add_questionset',{ user: req.user,  error: req.flash("error"), csrfToken: req.csrfToken()});
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
                res.render('questionsets/edit_questionset', { questionset: result[0], path: path, csrfToken: req.csrfToken(),
                    error: req.flash("error"), });
            })
            .catch(err => {
                console.log(err);
                res.render('error');
            });
    },

    editquestionset: (req, res) => {
        let questionset = req.body;
        questionset.title = questionset_model.format(questionset.title).trim();
        questionset.description = questionset_model.format(questionset.description).trim();
        upload(req, res, err => {
            if (questionset.title.length <= 0 ||questionset.description.length <= 0 ) {
                req.flash("error", "Begin is not a space");
                res.redirect('back');
            } else {
                var fileName = "";
                if (req.file) {
                    fileName = req.file.filename;
                    try {
                        //file removed
                        fs.unlink('./public/img/' + questionset.image, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        })
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    fileName = questionset.image;
                }
                questionset_model.update(questionset, fileName, req.params.qs_id)
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
        // Create room
        question_model.findByQuestionsetId(req.params.qs_id)
            .then(result => {
                if(result.length > 0){
                    res.render('host/middle', { question: result, qs_id: req.params.qs_id });
                }else{
                    res.redirect(`/host/questionset/${req.params.qs_id}/question/add`);
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
};