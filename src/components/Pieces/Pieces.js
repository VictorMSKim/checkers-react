import React from 'react';
import './Pieces.css';

class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isKing: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { checkValidSquare, pieceX, pieceY } = this.props;
        const { isKing } = this.state;
        checkValidSquare(pieceX, pieceY, isKing)
    }

    render() {
        const { isKing } = this.state
        return (
            <div className={`piece ${this.props.className}`} onClick={this.handleClick}>
                {isKing ? <div><p className="king">King</p></div> : null}
            </div>
        );
    }
}

export default Pieces;
