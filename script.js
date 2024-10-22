document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('minesweeper-container');
    const resetButton = document.getElementById('reset-button');
    const width = 10;
    const height = 10;
    const mineCount = 20;
    let cells = [];
    let mines = [];
    let gameOver = false;

    function createBoard() {
        grid.innerHTML = '';
        cells = [];
        mines = Array(mineCount).fill('mine').concat(Array(width * height - mineCount).fill('safe'));
        mines.sort(() => Math.random() - 0.5);
        gameOver = false;

        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add('cell');
            cell.addEventListener('click', () => revealCell(cell));
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    function revealCell(cell) {
        if (gameOver) return;
        const id = cell.id;
        if (cell.classList.contains('revealed')) return;
        cell.classList.add('revealed');

        if (mines[id] === 'mine') {
            cell.classList.add('mine');
            alert('Game Over!');
            revealAllMines();
            gameOver = true;
        } else {
            const total = countMinesAround(id);
            if (total !== 0) {
                cell.textContent = total;
            } else {
                revealAdjacentCells(id);
            }
        }
    }

    function countMinesAround(id) {
        let total = 0;

        const neighbors = [
            id - 1, id + 1,
            id - width, id + width,
            id - width - 1, id - width + 1,
            id + width - 1, id + width + 1
        ];

        neighbors.forEach(neighbor => {
            if (neighbor >= 0 && neighbor < width * height) {
                if (mines[neighbor] === 'mine') total++;
            }
        });

        return total;
    }

    function revealAdjacentCells(id) {
        const isLeftEdge = (id % width === 0);
        const isRightEdge = (id % width === width - 1);

        setTimeout(() => {
            if (id > 0 && !isLeftEdge) revealCell(cells[id - 1]);
            if (id > width - 1 && !isRightEdge) revealCell(cells[id + 1 - width]);
            if (id > width) revealCell(cells[id - width]);
            if (id > width + 1 && !isLeftEdge) revealCell(cells[id - 1 - width]);
            if (id < width * height - 1 && !isRightEdge) revealCell(cells[id + 1]);
            if (id < width * height - width && !isLeftEdge) revealCell(cells[id - 1 + width]);
            if (id < width * height - width - 1 && !isRightEdge) revealCell(cells[id + 1 + width]);
            if (id < width * height - width) revealCell(cells[id + width]);
        }, 10);
    }

    function revealAllMines() {
        cells.forEach((cell, index) => {
            if (mines[index] === 'mine') {
                cell.classList.add('revealed', 'mine');
            }
        });
    }

    resetButton.addEventListener('click', createBoard);

    createBoard();

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);
});