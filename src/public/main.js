import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const game_container = document.querySelector('.game');
const board_ui = document.querySelector('.board_ui');
const external_ui1 = document.querySelector('.external_ui1');
const external_ui2 = document.querySelector('.external_ui2');


// Set dimensions

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const bodyStyle = getComputedStyle(document.body);

const horizontalMargin = parseFloat(bodyStyle.marginLeft) + parseFloat(bodyStyle.marginRight);
const verticalMargin = parseFloat(bodyStyle.marginTop) + parseFloat(bodyStyle.marginBottom);

const maxAvailableWidth = screenWidth - horizontalMargin;
const maxAvailableHeight = screenHeight - verticalMargin;

const minDimension = Math.min(maxAvailableWidth, maxAvailableHeight, 600);

const boardDimension = minDimension * 5/6;

// Define game

const game = new Game(game_container, canvases, board_ui, external_ui1, external_ui2, boardDimension, boardDimension);