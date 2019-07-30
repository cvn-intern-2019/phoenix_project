const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home')
    });

    app.route('/player/question')
        .get((req, res) => {
            res.render('player/qa');
        })
}