const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home', { csrfToken: req.csrfToken() })
    });

    app.get('/player/small-statistic', (req, res) => {
        res.render('player/smallStatistic', {
            layout: 'player.hbs'
        })
    });

    app.route('/player/question')
        .get((req, res) => {
            res.render('player/qa', {
                layout: 'player.hbs'
            });
        })
    app.route('/player/new_game')
        .get((req, res) => {
            res.render('player/new_game', {
                layout: 'player.hbs'
            });
        })

    app.get('/player/final-stat', (req, res) => {
        res.render('player/final-stat', {
            layout: 'player.hbs'
        });
    });

    app.post('/player/waiting', (req, res) => {
        res.render('player/waiting', { info: req.body });
    });
}