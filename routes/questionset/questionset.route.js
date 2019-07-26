var questionset = require('../../models/questionset/questionset.model');

const multer = require('multer');


module.exports = function (app) {
    app.get('/questionset', (req, res) => {
        //res.end(" question sets list");
        var p = questionset.all();
        p.then(rows => {
            console.log(rows);
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
            console.log(req.body);
            console.log("abc");
            req.body.file = req.file.ororiginalname;
            questionset.add(req.body)
                .then(id => {
                    // res.render('questionsets/add_questionset');
                    test(req, res, err => {
                        if (err) {
                            res.render('questionsets/add_questionset');
                        } else {
                            console.log(req.file);
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.end('error occured.')
                });
        })


    // app.get('/edit/:id', (req, res) => {
    //     var id = req.params.id;
    //     questionset.single(id).then(rows => {
    //         if (rows.lenght > 0) {
    //             res.render('questionsets/edit_questionset', {
    //                 error: false,
    //                 question_set: rows[0]
    //             });
    //         } else {
    //             res.render('questionsets/edit_questionset', {
    //                 error: true,
    //             });
    //         }
    //     });
    // })
};