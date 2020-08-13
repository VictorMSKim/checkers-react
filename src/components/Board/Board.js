import React from 'react';
import './Board.css';
import Square from '../Square/Square';
import {initialBoardState, light, dark, highlight, columns, rows} from '../../utils/constants';
import {removeDuplicates, isPresentInArray} from '../../utils/utils';

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            boardState: initialBoardState,
            redPaths: [[3, 0], [3, 2], [3, 4], [3, 6]],
            blackPaths: [[4, 1], [4, 3], [4, 5], [4, 7]],
            enemy: [],
            selectedRedPiece: [],
            selectedBlackPiece: [],
            isolatedRedPath: [],
            isolatedBlackPath: [],
        }
        this.updateBoardState = this.updateBoardState.bind(this)
        this.highlightSquare = this.highlightSquare.bind(this)
        this.showPossiblePaths = this.showPossiblePaths.bind(this)
        this.renderSquares = this.renderSquares.bind(this)
    }

    updateBoardState(newPieceX, newPieceY) {
        const { boardState, selectedRedPiece, selectedBlackPiece, enemy, isolatedRedPath, isolatedBlackPath } = this.state
        let newBoardState = boardState
        this.cleanBoardHighlight(newBoardState);
        this.movePiece(selectedRedPiece, newPieceX, newPieceY, newBoardState, enemy, isolatedRedPath);
        this.movePiece(selectedBlackPiece, newPieceX, newPieceY, newBoardState, enemy, isolatedBlackPath);
        this.setState({boardState: newBoardState, selectedRedPiece: [], selectedBlackPiece: []})
    }

    identifyEnemyPiece(pieceType, movesArray, board) {
        const enemy = [];
        if(pieceType === 'r') {
            for(let i = 0; i < movesArray.length; i++) {
                if(board[movesArray[i][0]][movesArray[i][1]] === 'b')
                    enemy.push(movesArray[i])
            }
            this.setState({enemyBlackPieces: enemy})
        }
        if(pieceType === 'b') {
            for(let i = 0; i < movesArray.length; i++) {
                if(board[movesArray[i][0]][movesArray[i][1]] === 'r')
                    enemy.push(movesArray[i])
            }
            this.setState({enemyRedPieces: enemy})
        }
        return enemy;
    }

    canJumpOver(pieceType, movesArray, board, pieceY) {
        const enemy = this.identifyEnemyPiece(pieceType, movesArray, board);
        const jump = []
        if(enemy.length) {
            if (pieceType === 'r'){
                for(let i = 0; i < enemy.length; i++) {
                    const enemyX = enemy[i][0];
                    const enemyY = enemy[i][1];
                    if(!this.isOutsideOfBoard([enemyX + 1, enemyY + 1]) && enemyY + 1 !== pieceY && (board[enemyX + 1][enemyY + 1] === '-')) {
                        jump.push([enemyX + 1, enemyY + 1])
                    }
                    if(!this.isOutsideOfBoard([enemyX + 1, enemyY - 1]) && enemyY - 1 !== pieceY && (board[enemyX + 1][enemyY - 1] === '-')) {
                        jump.push([enemyX + 1, enemyY - 1])
                    }
                }
            }
            if (pieceType === 'b') {
                for(let i = 0; i < enemy.length; i++) {
                    const enemyX = enemy[i][0];
                    const enemyY = enemy[i][1];
                    if(!this.isOutsideOfBoard([enemyX - 1, enemyY + 1]) && enemyY + 1 !== pieceY && (board[enemyX - 1][enemyY + 1] === '-')) {
                        jump.push([enemyX - 1, enemyY + 1])
                    }
                    if(!this.isOutsideOfBoard([enemyX - 1, enemyY - 1]) && board.length && enemyY - 1 !== pieceY && (board[enemyX - 1][enemyY - 1] === '-')) {
                        jump.push([enemyX - 1, enemyY - 1])
                    }
                }
            }
        }
        this.setState({enemy: enemy})
        return jump
    }

    movePiece(selectedPiece, newPieceX, newPieceY, board, enemy, isolatedMoves) {
        if(selectedPiece.length && this.isMoveLegal([newPieceX, newPieceY], isolatedMoves)) {
            const pieceType = board[selectedPiece[0]][selectedPiece[1]] === 'r' ? 'r' : 'b';
            if(enemy.length && newPieceX === isolatedMoves[0][0] && newPieceY === isolatedMoves[0][1]) board[enemy[0][0]][enemy[0][1]] = '-'
            board[newPieceX][newPieceY] = pieceType;
            board[selectedPiece[0]][selectedPiece[1]] = '-'
        }
    }

    isMoveLegal(move, allowedMovesArray) {
        return isPresentInArray(allowedMovesArray, move);
    }

    isolatePieceMoves(selectedPiece, piecePaths, board) {
        const moves = [];
        let jump = [];
        let pieceType;
        if (selectedPiece.length) {
            pieceType = board[selectedPiece[0]][selectedPiece[1]] === 'r' ? 'r' : 'b';
            const pieceX = board[selectedPiece[0]][selectedPiece[1]] === 'r' ? selectedPiece[0] + 1 : selectedPiece[0] - 1;
            if(isPresentInArray(piecePaths, [pieceX, selectedPiece[1] + 1])) 
                moves.push([pieceX, selectedPiece[1] + 1])
            if(isPresentInArray(piecePaths, [pieceX, selectedPiece[1] - 1])) 
                moves.push([pieceX, selectedPiece[1] - 1])
            jump = this.canJumpOver(pieceType, moves, board, selectedPiece[1])
            // this.setState({isolatedPath: moves})
            // console.log(jump)
            // console.log(moves)
        }
        if(jump.length) return jump
        return moves;
    }

    showPossiblePaths(board) {
        let possibleRedPaths = [];
        let possibleBlackPaths = [];
        this.findAllMoves(board, possibleRedPaths, possibleBlackPaths);
        possibleBlackPaths = removeDuplicates(possibleBlackPaths)
        possibleRedPaths = removeDuplicates(possibleRedPaths)
        this.removeInvalidMovements(possibleRedPaths)
        this.removeInvalidMovements(possibleBlackPaths)
        this.setState({redPaths: possibleRedPaths, blackPaths: possibleBlackPaths})
        return [possibleRedPaths, possibleBlackPaths]
    }

    findAllMoves(board, possibleRedPaths, possibleBlackPaths) {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                if(board[j][i] === 'r')
                    possibleRedPaths.push([j + 1, i + 1], [j + 1, i - 1])
                if(board[j][i] === 'b')
                    possibleBlackPaths.push([j - 1, i + 1], [j - 1, i - 1])
            }
        }
    }

    isOutsideOfBoard(positionsArray) {
        return positionsArray[0] > 7 || positionsArray[0] < 0 || positionsArray[1] < 0 || positionsArray[1] > 7
    }

    removeAlreadyOccupied(positionsArray, board) {
        if(positionsArray.length) {
            const pieceType = board[positionsArray[0][0]][positionsArray[0][1]]
            for(let i = 0; i < positionsArray.length; i++) {
                if(board[positionsArray[i][0]][positionsArray[i][1]] === pieceType) {
                    positionsArray.splice(i, 1);
                    i--
                }
            }
        }

    }

    removeInvalidMovements(movementsArray) {
        for (let i = 0; i < movementsArray.length; i++) {
            if (this.isOutsideOfBoard(movementsArray[i])) {
                movementsArray.splice(i, 1)
                i--;
            }
        }
    }

    cleanBoardHighlight(highlightedBoard) {
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                if(highlightedBoard[j][i] === 'h') highlightedBoard[j][i] = '-'  
            }
        }
    }

    highlightSquare(pieceX, pieceY, pieceType) {
        const {redPaths, blackPaths, boardState, selectedRedPiece, selectedBlackPiece} = this.state
        let redPath = [];
        let blackPath = [];
        let highlightBoard = boardState
        let selectedPiece = [pieceX, pieceY]
        this.cleanBoardHighlight(highlightBoard)
        if(pieceType === 'r') {
            redPath = this.showPossiblePaths(boardState)[0]
            redPath = this.isolatePieceMoves(selectedPiece, redPath, boardState)
            console.log(redPath)
            for(let i = 0; i < redPath.length; i++) {
                    if(highlightBoard[redPath[i][0]][redPath[i][1]] === 'h') highlightBoard[redPath[i][0]][redPath[i][1]] = '-'
                    else if(highlightBoard[redPath[i][0]][redPath[i][1]] === '-') highlightBoard[redPath[i][0]][redPath[i][1]] = 'h'  
            }
            this.setState({boardState: highlightBoard, selectedRedPiece: [pieceX, pieceY], selectedBlackPiece: [], isolatedRedPath: redPath, isolatedBlackPath: []})
        }
        else if(pieceType === 'b') {
            blackPath = this.showPossiblePaths(boardState)[1]
            blackPath = this.isolatePieceMoves(selectedPiece, blackPath, boardState)
            console.log(blackPath)
            for(let i = 0; i < blackPath.length; i++) {
                if(highlightBoard[blackPath[i][0]][blackPath[i][1]] === 'h') highlightBoard[blackPath[i][0]][blackPath[i][1]] = '-'
                else if(highlightBoard[blackPath[i][0]][blackPath[i][1]] === '-') highlightBoard[blackPath[i][0]][blackPath[i][1]] = 'h'  
        }
            this.setState({boardState: highlightBoard, selectedBlackPiece: [pieceX, pieceY], selectedRedPiece: [], isolatedBlackPath: blackPath, isolatedRedPath: []})
        }

    }

    endGame() {
        const {redPaths, blackPaths} = this.state
        return !redPaths.length || !blackPaths.length 
    }

    renderSquares() {
        const { boardState } = this.state
        let columnsToRender = [];
        const divs = [];
        let squareColor = light;
        let freeSquare = false;
        for(let i = 0; i < initialBoardState.length; i++) {
            for(let j = 0; j < initialBoardState.length; j++) {
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) squareColor = dark;
                else squareColor = light;
                if (boardState[j][i] === 'h') squareColor = highlight
                freeSquare = (boardState[j][i] === 'h' || boardState[j][i] === '-') && (squareColor === dark || squareColor === highlight);
                columnsToRender.push(
                    <Square className={squareColor} piece={boardState[j][i]} key={7 * i + j} isfree={freeSquare} 
                        x={j} y={i} movePiece={this.updateBoardState} highlightPossibleSquares={this.highlightSquare} />
                )
            }
            divs.push(columnsToRender)
            columnsToRender = []
        }
        return divs;
    }

    render() {
        const { redPaths, blackPaths } = this.state;
        return (
            <div className="board">
                {this.endGame() ? <div><p>{redPaths.length === 0 ? "BLACK WINS":"RED WINS"}</p></div> : this.renderSquares().map((elem, index) => <div key={index}>{elem}</div>)}
            </div>
        );
    }
}

export default Board;