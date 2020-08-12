import React from 'react';
import './Pieces.css';

class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isKing: false,
            selected: true
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { checkValidSquare, pieceX, pieceY } = this.props;
        checkValidSquare(pieceX, pieceY)
    }

    render() {
        return (
            <div className={`piece ${this.props.className}`} onClick={this.handleClick} />
        );
    }
}

export default Pieces;
