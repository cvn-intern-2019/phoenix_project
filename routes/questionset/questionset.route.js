var express = require("express");
var router = express.Router();
var questionset = require('../../models/questionset/questionset.model')

router.get('/', (req, res) => {
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

router.get('/add', (req, res) => {
    res.render('questionsets/add_questionset')
})

router.post('/add', (req, res) => {
    console.log(req.body);
    console.log("abc");
    questionset.add(req.body)
        .then(id => {
            console.log(id);
            // res.render('questionsets/add_questionset');
            upload(req,res, err => {
                if(err) {
                    res.render('questionsets/add_questionset');
                }else {
                    console.log(req.file);
                    
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.end('error occured.')
        });
})


router.get('/edit/:id', (req, res) => {
    var id = req.params.id;
    questionset.single(id).then(rows => {
        if(rows.lenght > 0) {
            res.render('questionsets/edit_questionset', {
            error : false,
            question_set : rows[0]
            });
         } else{
            res.render('questionsets/edit_questionset', {
                error : true,
            });
        }
    });
})
module.exports = router;