import { Game } from "./game.js";

const canvases = {
    board: document.querySelector('#board')
};

const game_container = document.querySelector('.game');
const board_ui = document.querySelector('.board_ui');
const label = document.querySelector('.label');
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

const minDimension = Math.min(maxAvailableWidth, maxAvailableHeight * (9/12), 900);

const boardDimension = minDimension;

// Define game

const game = new Game(game_container, canvases, label, board_ui, external_ui1, external_ui2, boardDimension, boardDimension);