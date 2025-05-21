const express = require('express');

const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'src/public')));

app.use((req, res) => {
    res.status(404);
    res.send(`<p>Not found</p>`);
});

app.use(express.json()); //Middleware so api requests are in json


const port = process.argv[2];
if (!port || isNaN(port) || port <= 0 || port > 65535) {
    console.error('Invalid or missing port number. Please enter a valid number between 1 and 65535.');
} else {
    console.log(`Server will start on port ${port}.`);
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});