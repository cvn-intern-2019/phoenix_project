const questionset_model = require('../models/questionset.model');

var db = require('../utils/db');
var multer = require('multer');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: './public/img/',
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
}).single('question_img');


module.exports = {
    showQuestionsetList: (req, res) => {
        let questionsetlist = `SELECT * FROM questionsets`;
        questionset_model.exec(questionsetlist)
            .then(q_list => {
                res.render('questionsets/questionset', {
                    questionset: q_list,
                });
            }).catch(err => {
                console.log(err);
            })
    },

    addquestionset: (req, res) => {
        res.render('questionsets/add_questionset', {csrfToken: req.csrfToken()});
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
                        res.redirect('/questionset');
                    })
                    .catch(err => {
                        res.render('questionsets/add_questionset');
                    });
            }
        })
    },

    findquestionset: (req, res) => {
        let sql = `select * from questionsets where questionset_id = '${req.params.qs_id}'`;
        db.query(sql)
            .then(result => {
                let path = '/img/' + result[0].questionset_image;
                res.render('questionsets/edit_questionset', { questionset: result[0], path: path, csrfToken: req.csrfToken() });
            })
            .catch(err => {
                res.redirect('/questionset');
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
                        res.redirect('/questionset');
                    })
                    .catch(err => {
                        res.render('questionset/add_questionset');
                    });
            }
        })
    }
};