const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home', { csrfToken: req.csrfToken() })
    });

    app.post('/player/waiting-room', (req, res) => {
        res.render('waiting_room', { info: req.body });
    });

    app.route('/player/question')
        .get((req, res) => {
            res.render('player/qa');
        })
    app.get('/nar-bar', (req, res) => {
        res.render('player/home', {
            layout: 'player.hbs'
        })
    });
    app.get('/player/middle', (req, res) => {
        res.render('player/middle', {
            layout: 'player.hbs'
        })
    });
}