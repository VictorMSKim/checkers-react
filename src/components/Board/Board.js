import React from 'react';
import './Board.css';
import Square from '../Square/Square';
import {initialBoardState, light, dark} from '../../utils/constants';

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            boardState: initialBoardState,
            redPaths: [[3,0], [3,2],[3,4],[3,6]],
            blackPaths: [[4,1], [4,3], [4,5], [4, 7]],
            selectedRedPiece: [],
            selectedBlackPiece: [],
        }
        this.updateBoardState = this.updateBoardState.bind(this)
        this.highlightSquare = this.highlightSquare.bind(this)
        this.showPossiblePaths = this.showPossiblePaths.bind(this)
        this.renderSquares = this.renderSquares.bind(this)
    }

    renderSquares() {
        const { boardState, redPaths, blackPaths } = this.state
        let columnsToRender = [];
        let divs = [];
        let squareColor = light;
        let freeSquare;
        for(let i = 0; i < initialBoardState.length; i++) {
            for(let j = 0; j < initialBoardState.length; j++) {
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) squareColor = dark;
                else squareColor = light;
                if (boardState[j][i] === 'h') squareColor = 'canMove'
                freeSquare = this.state.boardState[j][i] === '-' && squareColor === dark;
                columnsToRender.push(
                    <Square className={squareColor} piece={boardState[j][i]} key={7 * i + j} isfree={freeSquare} 
                        x={j} y={i} movePiece={this.updateBoardState} highlightPossibleSquares={this.highlightSquare} red={redPaths} black={blackPaths} />
                )
            }
        }
        for(let i = 0; i < 8; i++) divs.push(columnsToRender.slice(i * 8, i * 8 + 8))
        return divs;
    }

    updateBoardState(newPieceX, newPieceY) {
        const { boardState, selectedRedPiece, selectedBlackPiece } = this.state
        let newBoardState = boardState
        if(selectedRedPiece.length) {
            newBoardState[newPieceX][newPieceY] = 'r';
            newBoardState[selectedRedPiece[0]][selectedRedPiece[1]] = '-'
        }
        else if(selectedBlackPiece.length) {
            newBoardState[newPieceX][newPieceY] = 'b';
            newBoardState[selectedBlackPiece[0]][selectedBlackPiece[1]] = '-'
        }
        this.setState({boardState: newBoardState})
        let paths = this.showPossiblePaths()
        this.setState({redPaths: paths[0], blackPaths: paths[1]})
    }

    showPossiblePaths() {
        const {boardState} = this.state
        let possibleRedPaths = []
        let possibleBlackPaths = []
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(boardState[j][i] === 'r')
                    possibleRedPaths.push([j+1, i+1], [j+1, i-1])
                if(boardState[j][i] === 'b')
                    possibleBlackPaths.push([j-1, i+1], [j-1, i-1])
            }
        }
        for (let i = 0; i < possibleRedPaths.length; i++) {
            if(boardState[possibleRedPaths[i][0]][possibleRedPaths[i][1]] === 'r' || 
                    possibleRedPaths[i][0] > 7 || possibleRedPaths[i][0] < 0 || 
                    possibleRedPaths[i][1] < 0 || possibleRedPaths[i][1] > 7) {
                possibleRedPaths.splice(i, 1)
                i--;
            }
        }
        for (let i = 0; i < possibleBlackPaths.length; i++) {
            if(boardState[possibleBlackPaths[i][0]][possibleBlackPaths[i][1]] === 'b' || 
                    possibleBlackPaths[i][0] > 7 || possibleBlackPaths[i][0] < 0 || 
                    possibleBlackPaths[i][1] < 0 || possibleBlackPaths[i][1] > 7) {
                possibleBlackPaths.splice(i, 1)
                i--;
            }
        }
        return [possibleRedPaths, possibleBlackPaths]
    }

    highlightSquare(pieceX, pieceY, pieceType) {
        const {redPaths, blackPaths, boardState, selectedRedPiece, selectedBlackPiece} = this.state
        let highlightBoard = boardState
        if(pieceType === 'r') {
            for(let i = 0; i < redPaths.length; i++) {
                if (redPaths[i][0] === pieceX + 1 && redPaths[i][1] === pieceY + 1 || redPaths[i][0] === pieceX + 1 && redPaths[i][1] === pieceY - 1)
                    if(highlightBoard[redPaths[i][0]][redPaths[i][1]] === 'h') highlightBoard[redPaths[i][0]][redPaths[i][1]] = '-'
                    else if(highlightBoard[redPaths[i][0]][redPaths[i][1]] === '-') highlightBoard[redPaths[i][0]][redPaths[i][1]] = 'h'  
            }
            this.setState({boardState: highlightBoard, selectedRedPiece: [pieceX, pieceY], selectedBlackPiece: []})
        }
        else if(pieceType === 'b') {
            for(let i = 0; i < blackPaths.length; i++) {
                if (blackPaths[i][0] === pieceX - 1 && blackPaths[i][1] === pieceY + 1 || blackPaths[i][0] === pieceX - 1 && blackPaths[i][1] === pieceY - 1)
                    if(highlightBoard[blackPaths[i][0]][blackPaths[i][1]] === 'h') highlightBoard[blackPaths[i][0]][blackPaths[i][1]] = '-'
                    else if(highlightBoard[blackPaths[i][0]][blackPaths[i][1]] === '-') highlightBoard[blackPaths[i][0]][blackPaths[i][1]] = 'h'  
            }
            this.setState({boardState: highlightBoard, selectedBlackPiece: [pieceX, pieceY], selectedRedPiece: []})
        }
    }

    render() {
        return (
            <div className="board">
                {this.renderSquares().map((elem, index) => <div key={index}>{elem}</div>)}
            </div>
        );
    }
}

export default Board;