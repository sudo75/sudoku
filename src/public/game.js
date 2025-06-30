class Game {
    constructor(game_container, canvases, board_ui, external_ui, width, height) {
        this.game_container = game_container;
        this.canvases = canvases;
        this.board_ui = board_ui;
        this.external_ui = external_ui;

        this.width = width;
        this.height = height;

        this.puzzle = null;

        this.status = 0; // Game off = 0, game on = 1

        this.selectedCell = {
            row: null,
            col: null
        };

        this.invalidHighlight = []; //Highlight these cells after incorrect answer

        this.initBoard();
        this.initUI_external();

        window.addEventListener('click', (event) => {

            if (this.status === 1) {
                if (event.target === canvases.board) {
                    let rect = this.canvases.board.getBoundingClientRect();
                    
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    this.selectCell(x, y);
                } else {
                    this.deselectCells();
                }
            } else if (this.status === 0) {

                switch (event.target.id) {
                    
                }

            }
            
        });

        document.addEventListener('keydown', (event) => {
            if (!isNaN(event.key)) {
                this.inputNumber(Number(event.key));
            }
        });

    }

    initBoard() {
        for (const key in this.canvases) {
            const canvas = this.canvases[key];

            canvas.width = this.width;
            canvas.height = this.height;

            canvas.style.width = `${this.width}px`;
            canvas.style.height = `${this.height}px`;
        }

        this.game_container.style.width = `${this.width}px`;
        this.game_container.style.height = `${this.height}px`;

        this.board_ui.style.width = `${this.width}px`;
        this.board_ui.style.height = `${this.height}px`;

        this.external_ui.style.width = `${this.width}px`;
        this.external_ui.style.height = `${this.height / 12}px`;
    }

    closeUI_board() {
        this.board_ui.style.display = 'none';

        // Clear UI elements
        const board_ui_elements = this.board_ui.querySelectorAll('*');
        for (const child of board_ui_elements) {
            this.board_ui.removeChild(child);
        }
    }

    initUI_board() {
        
        this.closeUI_board();

        this.board_ui.style.display = '';

        let new_UI_elements = [];

        if (this.status === 0) { // New game menu

            // Easy
            const game_easy = document.createElement('button');
            game_easy.innerText = 'Easy';
            game_easy.classList.add('btn');

            game_easy.addEventListener('click', () => {
                this.startGame(0);
            });

            new_UI_elements.push(game_easy);
            
        }


        for (const UI_element of new_UI_elements) {
            this.board_ui.append(UI_element);
        }
    }

    closeUI_external() {
        // Clear UI elements
        const external_ui_elements = this.external_ui.querySelectorAll('*');
        for (const child of external_ui_elements) {
            this.external_ui.removeChild(child);
        }
    }

    initUI_external() {

        this.closeUI_external();

        let new_UI_elements = [];

        if (this.status === 0) {
            const newGame = document.createElement('button');
            newGame.innerText = 'New Game';
            newGame.classList.add('btn');

            newGame.addEventListener('click', () => {
                this.initUI_board();
            });

            new_UI_elements.push(newGame);
            
        }

        if (this.status === 1) {
            for (let i = 1; i <= 9; i++) {
                const btn = document.createElement('button');
                btn.innerText = i;
                btn.classList.add('btn');

                btn.addEventListener('click', () => {
                    this.inputNumber(i);
                });

                new_UI_elements.push(btn);
            }
            
            
        }


        for (const UI_element of new_UI_elements) {
            this.external_ui.append(UI_element);
        }
        

        
    }

    setStatus(setting) {
        this.status = setting;

        if (this.status === 0) {
            this.board_ui.style.hidden = false;
        } else if (this.status === 1) {
            this.board_ui.style.hidden = true;
        }
    }

    startGame(difficulty) {
        this.setStatus(1);

        this.closeUI_board();
        this.initUI_external();


        this.getGame();
    }

    async getGame() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: ''
        }

        fetch('api/games', options) // include options to set values (ex. method will default to GET, otherwise)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = response.json(); // Promise
                
                return data; // Will return once promise is fulfilled
            })
            .then(data => {
                console.log('Server response:', data);

                this.puzzle = JSON.parse(JSON.stringify(data.puzzle));
                this.base_puzzle = JSON.parse(JSON.stringify(data.puzzle));
                this.id = data.id;

                this.renderBoard();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    isPlayerInput(row, col) { //Check if this value was inputted by the player --- not of the original puzzle
        if (this.puzzle[row][col] !== this.base_puzzle[row][col]) return true;

        return false;
    }

    onLoss() {

    }

    renderBoard() {
        if (!this.puzzle) return;

        const board = this.canvases.board;
        const board_ctx = board.getContext('2d');

        const cell_width = this.width / 9;
        const cell_height = this.height / 9;

        this.cell_width = cell_width;
        this.cell_height = cell_height;

        // Clear canvas
        board_ctx.clearRect(0, 0, this.width, this.height);

        // Draw cells
        board_ctx.font = `${cell_height * 0.6}px Times New Roman`;
        board_ctx.textAlign = "center";
        board_ctx.textBaseline = "middle";

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = this.puzzle[row][col];

                //Highlight cell
                if (row === this.selectedCell.row && col === this.selectedCell.col) {
                    board_ctx.fillStyle = "lightgrey";
                    board_ctx.fillRect(col * cell_width, row * cell_height, cell_width, cell_height);
                }
                if (this.invalidHighlight.some(cell => cell.row === row && cell.col === col)) {
                    board_ctx.fillStyle = "rgb(255, 180, 180)";
                    board_ctx.fillRect(col * cell_width, row * cell_height, cell_width, cell_height);
                }


                // Draw number if not zero
                if (value !== 0) {
                    if (this.isPlayerInput(row, col)) board_ctx.fillStyle = "rgb(100, 100, 100)";
                    if (!this.isPlayerInput(row, col)) board_ctx.fillStyle = "black";
                    
                    board_ctx.fillText(value, col * cell_width + cell_width / 2, row * cell_height + cell_height / 2);
                }

                // Draw cell border
                board_ctx.strokeStyle = "lightgrey";                
                board_ctx.lineWidth = 1;
                board_ctx.strokeRect(col * cell_width, row * cell_height, cell_width, cell_height);
            }
        }

        // Draw thicker grid lines for 3x3 boxes
        board_ctx.strokeStyle = "black";
        board_ctx.lineWidth = 2;
        for (let i = 0; i <= 9; i++) {
            if (i % 3 === 0) {
                // Vertical thick lines
                board_ctx.beginPath();
                board_ctx.moveTo(i * cell_width, 0);
                board_ctx.lineTo(i * cell_width, this.height);
                board_ctx.stroke();

                // Horizontal thick lines
                board_ctx.beginPath();
                board_ctx.moveTo(0, i * cell_height);
                board_ctx.lineTo(this.width, i * cell_height);
                board_ctx.stroke();
            }
        }
    }

    selectCell(x, y) {
        const row = Math.floor(y / this.cell_height);
        const col = Math.floor(x / this.cell_width);

        this.selectedCell = {
            row: row,
            col: col
        };

        this.renderBoard();
    }

    deselectCells() {
        this.selectedCell = {
            row: null,
            col: null
        };

        this.renderBoard();
    }

    inputNumber(number) {
        const { row, col } = this.selectedCell;

        if (this.status !== 1) return;
        if (row == null || col == null) return;

        //console.log(`row: ${row}, col: ${col}, input: ${number}`);

        fetch(`/api/games/${this.id}/input`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ row: row, col: col, input: number })
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = response.json(); // Promise
                
                return data; // Will return once promise is fulfilled
            })
            .then(data => {
                console.log('Server response:', data);

                this.puzzle = data.puzzle;
                
                if (!data.valid) {
                    this.invalidHighlight.push({row: row, col: col});

                    setTimeout(() => {
                        
                        for (let i = this.invalidHighlight.length - 1; i >= 0; i--) {
                            const cell = this.invalidHighlight[i];
                            if (cell.row === row && cell.col === col) {
                                this.invalidHighlight.splice(i, 1);
                            }
                        }
                        
                        this.renderBoard();
                    }, 2000);
                }
                

                this.renderBoard();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    

    }
}

export { Game };