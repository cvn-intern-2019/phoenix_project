const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home')
    });
    app.get('/small-statistic', (req, res) => {
        res.render('player/smallStatistic', {
        	layout: 'player.hbs'
        })
    });
}