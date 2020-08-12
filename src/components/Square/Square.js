import React from 'react';
import Pieces from '../Pieces/Pieces';
import {red, black} from '../../utils';
import './Square.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isfree: this.props.isfree,
            x: this.props.x,
            y: this.props.y,
        }
        this.movePiece = this.movePiece.bind(this)
        this.checkValidSquare = this.checkValidSquare.bind(this)
        this.renderPiece = this.renderPiece.bind(this)
    }

    renderPiece(piece) {
        const {x, y} = this.state;
        let pieceColor;
        if(piece === '-' || piece === 'h') return null;
        pieceColor = piece === 'r' ? red : black;
        return (<Pieces className={pieceColor} pieceX={x} pieceY={y} piece={piece} checkValidSquare={this.checkValidSquare}/>)
    }

    movePiece() {
        const {isfree, x, y} = this.state
        const {movePiece} = this.props
        if(isfree) movePiece(x, y)
    }

    checkValidSquare(pieceX, pieceY, pieceType, selected) {
        const {highlightPossibleSquares} = this.props
        highlightPossibleSquares(pieceX, pieceY, pieceType, selected)
    }

    render() {
        return (
            <div className={`square ${this.props.className}`} value={this.props.value} onClick={this.movePiece} >
                {this.renderPiece(this.props.piece)}
            </div>
        );
    }
}

export default Square;
