import {useState} from "react";


function Square({value, onSquareClick, ifWin}) {
    return (
        <button
            className="square"
            onClick={onSquareClick}
            style={{backgroundColor: ifWin ? "green" : "white"}}>
            {value}
        </button>
    )
}

function Board({xIsNext, squares, onPlay}) {

    function drawBoard() {
        let rows = []
        for (let row = 0; row < 3; row++) {
            let rowElems = []
            for (let col = 0; col < 3; col++) {
                rowElems.push(
                    <Square
                        key={`square-${row}-${col}`}
                        value={squares[row][col]["value"]}
                        onSquareClick={() => handleClick(row, col)}
                        ifWin={squares[row][col]["ifWin"]}
                    />
                )
            }
            rows.push(
                <div key={`row-${row}`} className="board-row">
                    {rowElems}
                </div>
            )
        }
        return rows
    }

    function handleClick(i, j) {
        const [_winner, _line] = calculateWinner(squares)
        if (squares[i][j]["value"] || _winner) return

        let nextSquares = squares.map(row => {
            return row.map(item => {
                let newItem = new Map();
                newItem["value"] = item["value"]
                newItem["ifWin"] = item["ifWin"]
                return newItem;
            })
        })

        nextSquares[i][j]["value"] = xIsNext ? "X" : "O"
        const [winner, line] = calculateWinner(nextSquares)

        if (winner) {
            for (let i = 0; i < line.length; i++) {
                const [x, y] = line[i]
                nextSquares[x][y]["ifWin"] = true
            }
        } 
        onPlay(nextSquares)
    }

    const [winner, line] = calculateWinner(squares)
    const status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O")

    return (
        <>
            <div className="status">{status}</div>
            {drawBoard()}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array.from({length: 3}, () => Array.from({length: 3}, () => new Map()))])
    const [currentMove, setCurrentMove] = useState(0)
    const [areMovesSorted, setAreMovesSorted] = useState(true)

    const xIsNext = currentMove % 2 == 0
    const currentSquares = history[currentMove]

    console.log(history)

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpToMove(idx) {
        setCurrentMove(idx)
    }

    const moves = history.map((squares, moveIdx) => {
        const description = moveIdx ? "Jump to move #" + moveIdx : "Go to game start"
        return (
            <li key={moveIdx}>
                {currentMove == moveIdx ?
                    "You are the move #" + moveIdx :
                    <button onClick={() => jumpToMove(moveIdx)}>{description}</button>}
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={() => setAreMovesSorted(!areMovesSorted)}>
                    Toggle moves sorting (current is {areMovesSorted ? "Yes" : "No"})
                </button>
                <ol>{areMovesSorted ? moves : moves.reverse()}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
    const lines = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ]

    for (let i = 0; i < lines.length; i++) {
        const [[a_x, a_y], [b_x, b_y], [c_x, c_y]] = lines[i];
        if (squares[a_x][a_y]["value"] && squares[a_x][a_y]["value"] === squares[b_x][b_y]["value"] && squares[a_x][a_y]["value"] === squares[c_x][c_y]["value"]) return [squares[a_x][a_y]["value"], lines[i]]
    }

    return [null, null]
}
