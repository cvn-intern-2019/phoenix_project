module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('index', { user: req.user })
    });
    app.get('/error', (req, res) => {
        res.render('error');
    });
}