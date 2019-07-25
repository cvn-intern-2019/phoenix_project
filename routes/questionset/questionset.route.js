var express = require("express");
var router = express.Router();
var questionset = require('../../models/questionset/questionset.model')

router.get('/', (req, res) => {
    //res.end(" question sets list");
    var p = questionset.all();
    p.then(rows=>{
        console.log(rows);
        res.render('questionsets/questionset' ,{
            questionset : rows
        });
    }).catch(err =>{
        console.log(err);
    });
})

router.get('/add', (req, res) =>{
    res.render('questionsets/add_questionset')
})

router.post('/add', (req, res) =>{
    console.log(req.body);
    questionset.add(req.body).then(id => {
        console.log(id);
        res.render('questionsets/add_questionset');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
})

module.exports = router;