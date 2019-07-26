var questionset = require('../../models/questionset/questionset.model');

var db = require('../../utils/db');

module.exports = function (app, test) {
    app.get('/questionset', (req, res) => {
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
            let questionset = req.body;
            test(req, res, err => {
                if (err) {
                    res.render('questionset/add_questionset'); 
                } else {
                    var filename = "";
                    if(req.file){
                        filename=req.file.filename;
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