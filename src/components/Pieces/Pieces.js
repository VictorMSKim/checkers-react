import React from 'react';
import './Pieces.css';

class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isKing: props.isKing
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { checkValidSquare, pieceX, pieceY, isKing } = this.props;
        checkValidSquare(pieceX, pieceY, isKing)
    }

    render() {
        const { isKing } = this.props
        return (
            <div className={`piece ${this.props.className}`} onClick={this.handleClick}>
                {isKing ? <div><p className="king">King</p></div> : null}
            </div>
        );
    }
}

export default Pieces;
