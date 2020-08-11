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
        this.showCoordinates = this.showCoordinates.bind(this)
    }

    isPiecePresent(piece) {
        let pieceColor;
        if(piece === '-') return null;
        pieceColor = piece === 'r' ? red : black;
        return (<Pieces className={pieceColor} pieceX={this.state.x} pieceY={this.state.y} />)
    }

    showCoordinates() {
        if(this.state.isfree) console.log(this.state.x, this.state.y)
    }

    render() {
        return (
            <div className={`square ${this.props.className}`} value={this.props.value} onClick={this.showCoordinates} >
                {this.isPiecePresent(this.props.piece)}
            </div>
        );
    }
}

export default Square;
