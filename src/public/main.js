import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const game_container = document.querySelector('.game');
const board_ui = document.querySelector('.board_ui');
const external_ui = document.querySelector('.external_ui');

const width = 600;
const height = 600;

const game = new Game(game_container, canvases, board_ui, external_ui, width, height);