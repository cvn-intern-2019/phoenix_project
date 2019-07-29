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
        let questionset_user = `SELECT questionsets.* FROM questionsets, user_questionset WHERE user_questionset.questionset_id = questionsets.questionset_id and user_questionset.user_id = ${req.user.user_id};`;
        questionset_model.exec(questionset_user)
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
                var sql = `INSERT INTO questionsets (questionset_title,questionset_description,questionset_image,questionset_state) 
                    VALUES ("${questionset.title}","${questionset.description}","${filename}","${questionset.status}")`;
                db.query(sql)
                    .then(result => {
                        var sql2 = `SELECT * FROM questionsets ORDER BY questionset_id desc`;
                        db.query(sql2)
                            .then(result => {
                                var sql = `INSERT INTO user_questionset (user_id, questionset_id) VALUES ("${req.user.user_id}","${result[0].questionset_id}")`;
                                console.log(result[0].questionset_id);
                                console.log(sql);
                                db.query(sql)
                                    .then(result => {
                                        res.redirect('/host/questionset');
                                    })
                                    .catch(err => {
                                        res.render('questionsets/add_questionset');
                                    });
                            })
                            .catch(err => {
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
        let sql = `SELECT * FROM questionsets WHERE questionset_id = '${req.params.qs_id}'`;
        db.query(sql)
            .then(result => {
                let path = '/img/' + result[0].questionset_image;
                res.render('questionsets/edit_questionset', { questionset: result[0], path: path, csrfToken: req.csrfToken() });
            })
            .catch(err => {
                res.redirect('/host/questionset');
            });
    },
    editquestionset: (req, res) => {
        let img_delete_query = `SELECT questionset_image FROM questionsets WHERE questionset_id = ${req.params.qs_id}`;
        questionset_model.exec(img_delete_query)
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
                var sql = `UPDATE questionsets SET questionset_title = '${questionset.title}',questionset_description = '${questionset.description}',questionset_image = '${filename}',questionset_state = '${questionset.status}'  WHERE questionset_id = '${req.params.qs_id}';`;
                console.log(sql);
                db.query(sql)
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
        let sql = `SELECT questionsets.* FROM questionsets, user_questionset 
        WHERE user_questionset.questionset_id = questionsets.questionset_id 
        and questionsets.questionset_id = ${req.params.qs_id} and user_questionset.user_id = ${req.user.user_id}`;
        db.query(sql)
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