var questionset = require('../../models/questionset/questionset.model');
var db = require('../../utils/db');



module.exports = function (app, test) {
    app.get('/questionset', (req, res) => {
        var p = questionset.all();
        p.then(rows => {
            res.render('questionsets/questionset', {
                questionset: rows
            });
        }).catch(err => {
            console.log(err);
        });
    })

    app.route('/questionset/add')
        .get((req, res) => {
            res.render('questionsets/add_questionset', { csrfToken: req.csrfToken() });
        })

        .post((req, res) => {
            let questionset = req.body;
            test(req, res, err => {
                if (err) {
                    res.render('questionset/add_questionset');
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
                            res.render('questionset/add_questionset');
                        });
                }
            })
        })

    app.route('/questionset/:qs_id/edit')
        .get((req, res) => {
            let sql = `select * from questionsets where questionset_id = '${req.params.qs_id}'`;
            db.query(sql)
                .then(result => {
                    let path = '/img/' + result[0].questionset_image;
                    res.render('questionsets/edit_questionset', { questionset: result[0],path:path, csrfToken: req.csrfToken() });
                })
                .catch(err => {
                    res.redirect('/questionset');
                });
        })

        .post((req, res) => {
            let questionset = req.body;
            let path = './public/img/' + questionset.questionset_image;
            test(req, res, err => {
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
            // let sql = `UPDATE questionsets SET questionset_title = '${req.body.title}',questionset_description = '${req.body.description}',questionset_image = '${req.body.image}', questionset_state = '${req.body.status}'  WHERE questionset_id = '${req.params.qs_id}';`
            // db.query(sql)
            //     .then(result => {
            //         res.redirect('/questionset');
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
        })
}