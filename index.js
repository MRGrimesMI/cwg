const express = require('express'); 
const http = require('http');
const hostname = 'localhost';
const port = 3000;

const path = require('path'); 
const morgan = require('morgan');
const worldRouter = require('./routes/worldRoutes');
const gameRouter = require('./routes/gameRoutes');
const playerRouter = require('./routes/playerRoutes');
const nationRouter = require('./routes/nationRoutes');
const bodyParser = require('body-parser');
const EP = require('./public/constants.js');


var app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/'+EP.WORLDS,worldRouter);
app.use('/'+EP.GAMES,gameRouter);
app.use('/'+EP.NATIONS, nationRouter);
app.use('/'+EP.PLAYERS, playerRouter);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/base.html'));
});
app.use((req, res, next) => {
	res.statusCode=200;
	res.setHeader("Content-Type", "text/html");
	res.end('<html><body><h1>Displaying Default .html Module</h1></body></http>');
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
      console.log(`>>> Server Running at ${hostname}:${port}`);
});

// Install routers
// add json middleware