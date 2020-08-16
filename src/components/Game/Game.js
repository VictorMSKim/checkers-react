import React from 'react';
import Board from '../Board/Board';
import {initialBoardState, light, dark, highlight, columns, rows} from '../../utils/constants';
import {removeDuplicates, removeEntry, isPresentInArray, checkIfInteger, calculateDelta} from '../../utils/utils';

class Game extends React.Component {
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
            turn: 'b',
            kingPieces: [],
        }
        this.updateBoardState = this.updateBoardState.bind(this)
        this.pieceClickHandler = this.pieceClickHandler.bind(this)
        this.showPossiblePaths = this.showPossiblePaths.bind(this)
    }

    updateBoardState(newPieceX, newPieceY) {
        const { boardState, selectedRedPiece, selectedBlackPiece, enemy, isolatedRedPath, isolatedBlackPath, turn, kingPieces } = this.state
        let newBoardState = boardState
        this.cleanBoardHighlight(newBoardState);
        this.movePiece(turn === 'r' ? selectedRedPiece : selectedBlackPiece, newPieceX, newPieceY, 
                        newBoardState, enemy, turn === 'r' ? isolatedRedPath : isolatedBlackPath, kingPieces);
        this.setState({boardState: newBoardState, selectedRedPiece: [], selectedBlackPiece: []})
    }

    switchTurn() {
        const {turn} = this.state
        this.setState({
            turn: turn === 'b' ? 'r' : 'b'
        })
    }

    identifyEnemyPiece(pieceType, movesArray, board) {
        const enemy = [];
        const enemyPiece = pieceType === 'r' ? 'b' : 'r';
        for(let i = 0; i < movesArray.length; i++) {
            if(board[movesArray[i][0]][movesArray[i][1]] === enemyPiece)
                enemy.push(movesArray[i])
        }
        return enemy;
    }

    canJumpOver(pieceType, movesArray, board, pieceY, pieceX) {
        const enemy = this.identifyEnemyPiece(pieceType, movesArray, board);
        const jump = []
        if(enemy.length) {
            for(let i = 0; i < enemy.length; i++) {
                const enemyX = enemy[i][0];
                const enemyY = enemy[i][1];
                const delta = calculateDelta(enemyX, enemyY, pieceX, pieceY)
                const freeSpace = [enemyX + delta[0], enemyY + delta[1]]
                if(!this.isOutsideOfBoard(freeSpace) && board[freeSpace[0]][freeSpace[1]] === '-') {
                    jump.push(freeSpace)
                }
            }
        }
        this.setState({enemy: enemy})
        return jump
    }

    enemyPosToRemove(oldPosX, oldPosY, newPosX, newPosY) {
        const delta = calculateDelta(oldPosX, oldPosY, newPosX, newPosY)
        const deltaX = delta[0] / 2;
        const deltaY = delta[1] / 2;
        const enemyPos = [newPosX + deltaX, newPosY + deltaY]
        return enemyPos
    }

    turnPieceIntoKing(pieceType, selectedPiece, kingPieces) {
        const kingPiecesArray = kingPieces
        if ((pieceType === 'r' && selectedPiece[0] === 7) || (pieceType === 'b' && selectedPiece[0] === 0)) {
            kingPiecesArray.push(selectedPiece)
            this.setState({
                kingPieces: kingPiecesArray
            })
        }
    }

    isPieceKing(selectedPiece, kingPiecesArray) {
        return isPresentInArray(kingPiecesArray, selectedPiece)
    }

    updatePieceKingPosition(selectedPiece, newPosX, newPosY, kingPieces) {
        const tempKingPieces = removeEntry(kingPieces, selectedPiece);
        tempKingPieces.push([newPosX, newPosY])
        this.setState({
            kingPieces: tempKingPieces
        })
    }

    removeKingEnemyPiece(enemyPos, kingPiecesCopy) {
        if(this.isPieceKing(enemyPos, kingPiecesCopy)) {
            kingPiecesCopy = removeEntry(kingPiecesCopy, enemyPos)
            this.setState({
                kingPieces: kingPiecesCopy
            })
        }
        return kingPiecesCopy
    }

    movePiece(selectedPiece, newPieceX, newPieceY, board, enemy, isolatedMoves, kingPieces) {
        let kingPiecesCopy = kingPieces
        const newPos = [newPieceX, newPieceY]
        if(selectedPiece.length && this.isMoveLegal(newPos, isolatedMoves)) {
            const pieceType = board[selectedPiece[0]][selectedPiece[1]] === 'r' ? 'r' : 'b';
            const enemyPos = this.enemyPosToRemove(selectedPiece[0], selectedPiece[1], newPieceX, newPieceY, isolatedMoves)
            if(enemy.length && checkIfInteger(enemyPos[0]) && checkIfInteger(enemyPos[1])) {
                board[enemyPos[0]][enemyPos[1]] = '-'
                kingPiecesCopy = this.removeKingEnemyPiece(enemyPos, kingPiecesCopy)
            }
            board[newPieceX][newPieceY] = pieceType;
            board[selectedPiece[0]][selectedPiece[1]] = '-'
            if(this.isPieceKing(selectedPiece, kingPiecesCopy)) {
                this.updatePieceKingPosition(selectedPiece, newPieceX, newPieceY, kingPiecesCopy)
            }
            this.turnPieceIntoKing(pieceType, newPos, kingPiecesCopy);
            this.switchTurn();
        }
    }

    isMoveLegal(move, allowedMovesArray) {
        return isPresentInArray(allowedMovesArray, move);
    }

    includeInArray(path, pieceX, pieceY, movesArray) {
        const left = pieceY - 1;
        const right = pieceY + 1;
        if(isPresentInArray(path, [pieceX, right])) 
            movesArray.push([pieceX, right])
        if(isPresentInArray(path, [pieceX, left])) 
            movesArray.push([pieceX, left])        
    }

    isolatePieceMoves(selectedPiece, piecePaths, board, isKing) {
        const moves = [];
        let jump = [];
        let pieceType;
        let pieceXFront;
        let pieceXBack;
        if (selectedPiece.length) {
            pieceType = board[selectedPiece[0]][selectedPiece[1]] === 'r' ? 'r' : 'b';
            pieceXFront = pieceType === 'r' ? selectedPiece[0] + 1 : selectedPiece[0] - 1;
            this.includeInArray(piecePaths, pieceXFront, selectedPiece[1], moves);
            if(isKing) {
                if(pieceType === 'r') pieceXBack = selectedPiece[0] - 1;
                if(pieceType === 'b') pieceXBack = selectedPiece[0] + 1;
                this.includeInArray(piecePaths, pieceXBack, selectedPiece[1], moves);
            }
            jump = this.canJumpOver(pieceType, moves, board, selectedPiece[1], selectedPiece[0]);
        }
        if(jump.length) return jump;
        return moves;
    }

    showPossiblePaths(board, isKing) {
        let possibleRedPaths = [];
        let possibleBlackPaths = [];
        this.findAllMoves(board, possibleRedPaths, possibleBlackPaths, isKing);
        possibleBlackPaths = removeDuplicates(possibleBlackPaths)
        possibleRedPaths = removeDuplicates(possibleRedPaths)
        this.removeInvalidMovements(possibleRedPaths)
        this.removeInvalidMovements(possibleBlackPaths)
        this.setState({redPaths: possibleRedPaths, blackPaths: possibleBlackPaths})
        return [possibleRedPaths, possibleBlackPaths]
    }

    insertMoves(paths, isKing, pieceType, posX, posY) {
        const front = pieceType === 'r' ? posX + 1 : posX - 1;
        const back = pieceType === 'r' ? posX - 1 : posX + 1;
        const left = posY - 1;
        const right = posY + 1;
        paths.push([front, right], [front, left])
        if(isKing) {
            paths.push([back, right], [back, left])
        }
    }

    findAllMoves(board, possibleRedPaths, possibleBlackPaths, isKing) {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const pieceType = board[j][i]
                if(pieceType === 'r') this.insertMoves(possibleRedPaths, isKing, pieceType, j, i)
                if(pieceType === 'b') this.insertMoves(possibleBlackPaths, isKing, pieceType, j, i)
            }
        }
    }

    isOutsideOfBoard(positionsArray) {
        return positionsArray[0] > 7 || positionsArray[0] < 0 || positionsArray[1] < 0 || positionsArray[1] > 7
    }

    removeInvalidMovements(movementsArray) {
        for (let i = 0; i < movementsArray.length; i++) {
            if (this.isOutsideOfBoard(movementsArray[i])) {
                movementsArray.splice(i, 1)
                i--;
            }
        }
    }

    calculatePieceMoves(path, board, selectedPiece, pieceType, isKing) {
        const possiblePaths = this.showPossiblePaths(board, isKing);
        path = pieceType === 'r' ? possiblePaths[0] : possiblePaths[1];
        path = this.isolatePieceMoves(selectedPiece, path, board, isKing)
        this.highlightBoard(path, board)
        this.setState({
            boardState: board, 
            selectedRedPiece: pieceType === 'r' ? selectedPiece : [], 
            selectedBlackPiece: pieceType === 'r' ? [] : selectedPiece, 
            isolatedRedPath: pieceType === 'r' ? path : [], 
            isolatedBlackPath: pieceType === 'r' ? [] : path
        })
    }

    pieceClickHandler(pieceX, pieceY, pieceType, isKing) {
        const {boardState, turn} = this.state
        let redPath = [];
        let blackPath = [];
        const path = pieceType === 'r' ? redPath : blackPath;
        let highlightBoard = boardState
        let selectedPiece = [pieceX, pieceY]
        this.cleanBoardHighlight(highlightBoard)
        if(pieceType === turn) {
            this.calculatePieceMoves(path, highlightBoard, selectedPiece, pieceType, isKing)
        }
    }

    endGame() {
        const {redPaths, blackPaths} = this.state
        return !redPaths.length || !blackPaths.length 
    }

    render() {
        const { redPaths, turn, boardState } = this.state;
        return (
            <div className="outerDiv">
                <h1>Qulture Challenge - Checkers</h1>
                <div>
                    {this.endGame() ? 
                        (<div>
                            <p>{redPaths.length === 0 ? "BLACK WINS":"RED WINS"}</p>
                        </div>) : 
                        <div>
                            <p className={`turnText ${turn === 'r' ? 'redTurnText' : null}`}>TURN: {turn === 'r' ? 'RED PLAYER 2' : 'BLACK PLAYER 1'}</p>
                        </div>
                    }
                    <Board pieceClickHandler={this.pieceClickHandler} boardState={boardState} />
                </div>
            </div>
        );
    }
}

export default Game;
