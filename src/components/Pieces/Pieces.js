import React from 'react';
import './Pieces.css';

class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { checkValidSquare, pieceX, pieceY, isKing } = this.props;
        checkValidSquare(pieceX, pieceY, isKing)
    }

    render() {
        const { isKing, pieceX, pieceY } = this.props
        return (
            <div className={`piece ${this.props.className}`} onClick={this.handleClick} data-testid="pieces" piecex={pieceX} piecey={pieceY}>
                {isKing ? <div><p className="king">King</p></div> : null}
            </div>
        );
    }
}

export default Pieces;
