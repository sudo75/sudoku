const express = require('express');

const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));

app.use(express.json()); //Middleware so api requests are in json

//No router needed --- simple req
app.get('/puzzle-sheet', (req, res) => {
    res.redirect('/puzzle-sheet.html');
});

//Set up routes
const router_game = require('./src/routes/router_game');
app.use('/api/games', router_game);

// Not found
app.use((req, res) => {
    res.status(404);
    res.send(`<p>Not found</p>`);
});



//Set port & initialise server
const port = process.argv[2];
if (!port || isNaN(port) || port <= 0 || port > 65535) {
    console.error('Invalid or missing port number. Please enter a valid number between 1 and 65535.');
} else {
    console.log(`Server will start on port ${port}.`);
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});