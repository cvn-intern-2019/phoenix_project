const authMiddleware = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get('/player', (req, res) => {
        res.render('player/home')
    });

    app.get('/player/final-stat' , (req,res) => {
        res.render('player/final-stat');
    });
}