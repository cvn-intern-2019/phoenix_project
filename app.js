const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})