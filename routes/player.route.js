const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home', {csrfToken: req.csrfToken()})
    });

    app.post('/player/waiting-room' , (req,res) => {
        res.render('waiting_room' , {info : req.body});
    });
}