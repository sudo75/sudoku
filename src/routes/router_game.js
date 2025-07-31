const express = require('express');
const router = express.Router();

//Define controllers
const controller_game = require('../controllers/controller_game');

// Route: POST /api/games - Create a new Sudoku game
router.post('/', controller_game.createGame);

// Route: GET /api/games/:id - Get a game by ID
router.get('/:id', controller_game.getPuzzleById); // :// makes an id param in req.params.id

// Route: PUT /api/games/:id/input - Update a game (e.g. player progress)
router.put('/:id/input', controller_game.updateGame);


// Route: DELETE /api/games/:id - Delete a game
router.delete('/:id', controller_game.deleteGame);

module.exports = router;