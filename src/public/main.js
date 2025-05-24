import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const width = 600;
const height = 600;

const game = new Game(canvases, width, height);

game.getGame();