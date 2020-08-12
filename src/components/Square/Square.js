import React from 'react';
import Pieces from '../Pieces/Pieces';
import {red, black} from '../../utils';
import './Square.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.movePiece = this.movePiece.bind(this)
        this.checkValidSquare = this.checkValidSquare.bind(this)
        this.renderPiece = this.renderPiece.bind(this)
    }

    renderPiece() {
        const {x, y, piece} = this.props;
        let pieceColor;
        if(piece === '-' || piece === 'h') return null;
        else if(piece === 'r') return (<Pieces className={red} pieceX={x} pieceY={y} piece={piece} checkValidSquare={this.checkValidSquare}/>)
        else if(piece === 'b') return (<Pieces className={black} pieceX={x} pieceY={y} piece={piece} checkValidSquare={this.checkValidSquare}/>)
    }

    movePiece() {
        const {movePiece, isfree, x, y} = this.props
        if(isfree) {
            movePiece(x, y)
        }
    }

    checkValidSquare(pieceX, pieceY) {
        const {highlightPossibleSquares, piece} = this.props
        highlightPossibleSquares(pieceX, pieceY, piece)
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
