class Game {
    constructor(canvases, width, height) {
        this.canvases = canvases;
        this.width = width;
        this.height = height;

        this.initBoard();

        this.puzzle = null;
    }

    initBoard() {
        for (const key in this.canvases) {
            const canvas = this.canvases[key];

            canvas.width = this.width;
            canvas.height = this.height;
        }
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
                
                return data; // Will return one promise is fulfilled
            })
            .then(data => {
                console.log('Server response:', data);

                this.puzzle = data.puzzle;
                this.renderBoard();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    renderBoard() {
        const board = this.canvases.board;
        const board_ctx = board.getContext('2d');

        const cell_width = this.width / 9;
        const cell_height = this.height / 9;

        // Clear canvas
        board_ctx.clearRect(0, 0, this.width, this.height);

        // Draw cells
        board_ctx.font = `${cell_height * 0.6}px Times New Roman`;
        board_ctx.textAlign = "center";
        board_ctx.textBaseline = "middle";

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = this.puzzle[row][col];

                // Draw number if not zero
                if (value !== 0) {
                    board_ctx.fillStyle = "black";
                    board_ctx.fillText(value, col * cell_width + cell_width / 2, row * cell_height + cell_height / 2);
                }

                // Draw cell border
                board_ctx.strokeStyle = "lightgray";
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
}

export { Game };