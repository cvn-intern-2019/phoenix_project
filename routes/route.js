module.exports = (app) => {
    app.get('/', (req,res) => {
        res.render('index', {user : req.user})
    });

    app.get('/waiting-room', (req, res) => {
        res.render('waiting_room')
    });

    app.post('/waiting' , (req,res) => {
        res.render('waiting' , {info : req.body});
    });
}