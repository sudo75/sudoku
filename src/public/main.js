import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const game_container = document.querySelector('.game');
const board_ui = document.querySelector('.board_ui');
const external_ui = document.querySelector('.external_ui');


// Set dimensions

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const bodyStyle = getComputedStyle(document.body);

const horizontalMargin = parseFloat(bodyStyle.marginLeft) + parseFloat(bodyStyle.marginRight);
const verticalMargin = parseFloat(bodyStyle.marginTop) + parseFloat(bodyStyle.marginBottom);

const maxAvailableWidth = screenWidth - horizontalMargin;
const maxAvailableHeight = screenHeight - verticalMargin;

const minDimension = Math.min(maxAvailableWidth, maxAvailableHeight, 600);

const width = minDimension;
const height = minDimension;

// Define game

const game = new Game(game_container, canvases, board_ui, external_ui, width, height);