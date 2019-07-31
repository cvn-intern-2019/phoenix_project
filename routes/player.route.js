const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', authMiddleware.alreadySignin, (req, res) => {
        res.render('player/home')
    });
    app.get('/nar-bar', (req, res) => {
        res.render('player/home', {
        	layout: 'player.hbs'
        })
    });
    
    app.get('/player/waiting_room',(req, res) => {
        res.render('player/home')
    });

    app.post('/player/waiting_room',(req, res) => {
        res.render('waiting_room')
    });
}