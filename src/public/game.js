class Game {
    constructor(game_container, canvases, label, board_ui, external_ui1, external_ui2, width, height) {
        this.game_container = game_container;
        this.canvases = canvases;
        this.label = label;
        this.board_ui = board_ui;
        this.external_ui1 = external_ui1;
        this.external_ui2 = external_ui2;

        this.width = width;
        this.height = height;

        this.base_puzzle = null;
        this.puzzle = null;
        this.puzzle_pencil = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));

        this.status = 0; // Game off = 0, game on = 1
        this.difficulty = 0; // 0 = easy, 1 = medium, 2 = hard, 3 = very hard
        this.errors = 0;

        this.selectedCell = {
            row: null,
            col: null
        };

        this.fontSize_external = this.height / 9 * 0.5;

        this.fontSize_cell;
        this.fontSize_pencil;

        this.pencil = false;

        this.reqPending = false;

        this.invalidHighlight = []; // Highlight these cells after incorrect answer

        this.initBoard();
        this.initUI_external();
        this.initLabel();

        window.addEventListener('click', (event) => {

            if (this.status === 1) {
                if (event.target === canvases.board) {
                    let rect = this.canvases.board.getBoundingClientRect();
                    
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    this.selectCell(x, y);
                } else {
                    if (!event.target.classList.contains('btn')) {
                        this.deselectCells();
                    }
                }
            }
            
        });


        this.heldKeys = new Set();

        document.addEventListener('keydown', (event) => {
            if (this.heldKeys.has(event.key)) return;
            this.heldKeys.add(event.key)

            if (!isNaN(event.key)) {
                this.inputNumber(Number(event.key));
            }
            if (event.key === 'Backspace') {
                this.erase_pencil();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.heldKeys.delete(event.key);
        });

        window.addEventListener('beforeunload', (event) => {
            if (this.status === 1) event.preventDefault();
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

        this.external_ui1.style.width = `${this.width}px`;
        this.external_ui1.style.height = `${this.height / 9}px`;
        this.external_ui2.style.width = `${this.width}px`;
        this.external_ui2.style.height = `${this.height / 9}px`;

        this.label.style.width = `${this.width}px`;
        this.label.style.height = `${this.height / 9}px`;

    }

    initLabel() {
        if (this.status === 0) {
            this.label.innerText = 'Sudoku';
            this.label.style.fontSize = `${this.fontSize_external}px`;
        } else if (this.status === 1 || this.status === 2 || this.status === 3) {
            const difficulty = (() => {
                switch (this.difficulty) {
                    case 0:
                        return 'Easy';
                    case 1:
                        return 'Medium';
                    case 2:
                        return 'Hard';
                    case 3:
                        return 'Very Hard';
                }
            })();
            this.label.innerText = `${difficulty} - ${this.errors}/3 errors`
            this.label.style.fontSize = `${this.fontSize_external}px`;
        }
    }

    clearBoard() {
        for (const key in this.canvases) {
            const canvas = this.canvases[key];
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

    }

    closeUI_board() {
        this.board_ui.style.pointerEvents = 'none';

        // Clear UI elements
        const board_ui_elements = this.board_ui.querySelectorAll('*');
        for (const child of board_ui_elements) {
            this.board_ui.removeChild(child);
        }
    }

    initUI_board() {
        
        this.closeUI_board();

        this.board_ui.style.pointerEvents = 'auto';

        let new_UI_elements = [];

        if (this.status === 0) { // New game menu

            const difficulties = [
                { label: 'Easy', level: 0 },
                { label: 'Medium', level: 1 },
                { label: 'Hard', level: 2 },
                { label: 'Very Hard', level: 3 }
            ];

            difficulties.forEach(({ label, level }) => {
                const button = document.createElement('button');
                button.innerText = label;
                button.classList.add('btn');

                button.addEventListener('click', () => {
                    this.startGame(level);
                    this.closeUI_board();
                });

                new_UI_elements.push(button);
            });
            
        } else if (this.status === 2) {

            const continue_btn = document.createElement('button');
            continue_btn.innerText = 'Loss - continue';
            continue_btn.classList.add('btn');

            continue_btn.addEventListener('click', () => {
                this.closeUI_board();
                this.status = 0;

                this.clearBoard();
                this.initUI_external();
                this.initLabel();
            });

            new_UI_elements.push(continue_btn);
        } else if (this.status === 3) {

            const continue_btn = document.createElement('button');
            continue_btn.innerText = 'Win - continue';
            continue_btn.classList.add('btn');

            continue_btn.addEventListener('click', () => {
                this.closeUI_board();
                this.status = 0;

                this.clearBoard();
                this.initUI_external();
                this.initLabel();
            });

            new_UI_elements.push(continue_btn);
        }


        for (const UI_element of new_UI_elements) {
            UI_element.style.fontSize = `${this.fontSize_external}px`;
            this.board_ui.append(UI_element);
        }
    }

    closeUI_external() {
        // Clear UI elements
        const external_ui1_elements = this.external_ui1.querySelectorAll('*');
        for (const child of external_ui1_elements) {
            this.external_ui1.removeChild(child);
        }
        const external_ui2_elements = this.external_ui2.querySelectorAll('*');
        for (const child of external_ui2_elements) {
            this.external_ui2.removeChild(child);
        }
    }

    initUI_external() {

        this.closeUI_external();

        let new_UI1_elements = [];
        let new_UI2_elements = [];

        if (this.status === 0) {
            const newGame = document.createElement('button');
            newGame.innerText = 'New Game';
            newGame.classList.add('btn');

            newGame.addEventListener('click', () => {
                this.initUI_board();
            });

            new_UI1_elements.push(newGame);
            
        }

        if (this.status === 1) {
            // Number input buttons
            for (let i = 1; i <= 9; i++) {
                const btn = document.createElement('button');
                btn.innerText = i;
                btn.classList.add('btn');

                btn.addEventListener('click', () => {
                    this.inputNumber(i);
                });

                new_UI1_elements.push(btn);
            }

            // Settings

            // Pencil
            const pencil = document.createElement('button');
            pencil.innerText = 'pencil off';
            pencil.classList.add('btn');

            pencil.addEventListener('click', () => {
                this.pencil = !this.pencil;

                pencil.innerText = this.pencil ? 'pencil on' : 'pencil off';
            });

            new_UI2_elements.push(pencil);

            // Eraser
            const erase = document.createElement('button');
            erase.innerText = 'erase';
            erase.classList.add('btn');

            erase.addEventListener('click', () => {
                this.erase_pencil();
            });

            new_UI2_elements.push(erase);

            // Exit
            const exit = document.createElement('button');
            exit.innerText = 'exit';
            exit.classList.add('btn');

            exit.addEventListener('click', () => {
                this.status = 2;
                this.onFinish();
            });

            new_UI2_elements.push(exit);
            
        }


        for (const UI_element of new_UI1_elements) {
            UI_element.style.fontSize = `${this.fontSize_external}px`;
            this.external_ui1.append(UI_element);
        }

        for (const UI_element of new_UI2_elements) {
            UI_element.style.fontSize = `${this.fontSize_external * 0.75}px`;
            this.external_ui2.append(UI_element);
        }
        

        
    }

    startGame(difficulty) {

        this.status = 1;
        this.difficulty = difficulty;
        
        this.closeUI_board();
        this.initUI_external();
        this.initLabel();


        this.getGame(difficulty);
    }

    async getGame(difficulty) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                difficulty: difficulty
            })
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

    onFinish() {
        this.initUI_board();
        this.initUI_external();

        this.selectedCell = {
            row: null,
            col: null
        };
        this.pencil = false;

        this.puzzle = null;
        this.base_puzzle = null;

        this.errors = 0;
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

                const values_pencil = this.puzzle_pencil[row][col];

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
                    
                    this.fontSize_cell = Math.floor((this.width / 9) * 0.7);
                    board_ctx.font = `${this.fontSize_cell}px "Times New Roman"`;

                    const x = col * cell_width + cell_width / 2;
                    const y = row * cell_height + cell_height / 2;

                    board_ctx.fillText(value, x, y);
                } else {
                    board_ctx.fillStyle = "rgb(100, 100, 100)";
                    for (let i = 0; i < values_pencil.length; i++) {
                        const value = values_pencil[i];

                        this.fontSize_pencil = this.fontSize_cell / 3;
                        board_ctx.font = `${this.fontSize_pencil}px "Courier"`;

                        const subRow = Math.floor((value - 1) / 3);
                        const subCol = (value - 1) % 3;

                        const subCell_width = cell_width / 3;
                        const subCell_height = cell_height / 3;

                        const x = (col * cell_width) + (subCell_width * subCol) + (subCell_width / 2);
                        const y = (row * cell_height) + (subCell_height * subRow) + (subCell_height / 2);

                        board_ctx.fillText(value, x, y);
                    }
                    
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

    inputPencil(number) {
        if (typeof number !== 'number') return;
        if (number < 1 || number > 9) return;

        const { row, col } = this.selectedCell;

        const number_index = this.puzzle_pencil[row][col].indexOf(number);
        if (number_index === -1) {
            this.puzzle_pencil[row][col].push(number);
        } else {
            this.puzzle_pencil[row][col].splice(number_index, 1);
        }
        
        this.renderBoard();
    }

    erase_pencil() {
        const { row, col } = this.selectedCell;
        if (row == null || col == null) return;

        this.puzzle_pencil[row][col] = [];

        this.renderBoard();
    }

    inputNumber(number) {
        if (typeof number !== 'number') return;
        if (number < 1 || number > 9) return;

        if (this.status !== 1) return;

        if (this.reqPending) return;

        const { row, col } = this.selectedCell;
        if (row == null || col == null) return;

        //console.log(`row: ${row}, col: ${col}, input: ${number}`);

        if (this.pencil) return this.inputPencil(number);

        this.reqPending = true;
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

                this.status = data.status;
                if (data.status === 2 || data.status === 3) { // loss or win
                    this.errors++;

                    this.renderBoard();
                    this.initLabel();
                    this.onFinish();
                    return;
                }
                
                if (!data.valid) {
                    this.errors++;

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
                
                this.reqPending = false;

                this.renderBoard();
                this.initLabel();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    

    }
}

export { Game };