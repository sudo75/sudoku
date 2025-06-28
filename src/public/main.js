import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const game_container = document.querySelector('.game');
const ui_container = document.querySelector('.ui');

const width = 600;
const height = 600;

const game = new Game(game_container, canvases, ui_container, width, height);

game.getGame();