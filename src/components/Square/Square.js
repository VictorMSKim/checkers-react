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
        const {x, y, piece, isKing} = this.props;
        let pieceColor;
        if(piece === '-' || piece === 'h') return null;
        pieceColor = piece === 'r' || piece === 'rh' ? red : black; 
        return (<Pieces className={pieceColor} pieceX={x} pieceY={y} piece={piece} checkValidSquare={this.checkValidSquare} isKing={isKing}/>)
    }

    movePiece() {
        const {movePiece, isfree, x, y} = this.props
        if(isfree) {
            movePiece(x, y)
        }
    }

    checkValidSquare(pieceX, pieceY, isKing) {
        const {pieceClickHandler, piece} = this.props
        pieceClickHandler(pieceX, pieceY, piece, isKing)
    }

    render() {
        return (
            <div className={`square ${this.props.className}`} onClick={this.movePiece} data-testid="squares">
                {this.renderPiece(this.props.piece)}
            </div>
        );
    }
}

export default Square;
