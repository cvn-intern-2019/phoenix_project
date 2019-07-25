module.exports = (app) => {
    app.get('/player', (req, res) => {
        res.render('player/home')
    });
}