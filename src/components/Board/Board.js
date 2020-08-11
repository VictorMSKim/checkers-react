import React from 'react';
import './Board.css';
import Square from '../Square/Square';
import {initialBoardState, light, dark} from '../../utils/constants';

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            boardState: initialBoardState
        }
    }

    renderSquares() {
        let columnsToRender = [];
        let divs = [];
        let squareColor = light;
        let freeSquare;
        for(let i = 0; i < initialBoardState.length; i++) {
            for(let j = 0; j < initialBoardState.length; j++) {
                if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) squareColor = dark;
                else squareColor = light;
                freeSquare = this.state.boardState[j][i] === '-' && squareColor === dark;
                columnsToRender.push(
                    <Square className={squareColor} piece={this.state.boardState[j][i]} key={7 * i + j} isfree={freeSquare} x={j} y={i}/>
                )
            }
        }
        for(let i = 0; i < 8; i++) divs.push(columnsToRender.slice(i * 8, i * 8 + 8))
        return divs;
    }

    updateBoardState() {
        
    }

    showPossiblePaths() {

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