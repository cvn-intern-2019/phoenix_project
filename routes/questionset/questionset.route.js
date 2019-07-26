var questionset = require('../../models/questionset/questionset.model');

module.exports = function (app,test) {

    //pathimage
    // const storage = multer.diskStorage({
    //     destination: './public/img/',
    //     filename: function (req, file, cb) {
    //         cb(null, file.filename + '-' + Date.now() +
    //             path.extname(file.originalname));
    //     }
    // })

    // const upload = multer({
    //     storage: storage
    // });
    // const test = upload.single('questionset_img');
    // app.use(test);

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
            let filename = '';
            test(req, res, err => {
                if (err) {
                    // res.render('questionsets/add_questionset');
                } else {
                    return filename = req.file.filename;                    
                    // res.render('questionsets/questionset');
                }
            })
            questionset.add(req.body)
                .then(id => {
                    console.log(id);
                    // res.render('questionsets/add_questionset');
                    
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