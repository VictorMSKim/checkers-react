import React from 'react';
import './Pieces.css';

class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isKing: false,
            selected: false,
            pieceX: this.props.pieceX,
            pieceY: this.props.pieceY
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => {return {selected: !prevState.selected}})
        if(this.state.selected) {
            this.setState({pieceX: this.props.newPieceX, pieceY: this.props.newPieceY})
        }
    }

    render() {
        return (
            <div className={`piece ${this.props.className}`} onClick={this.handleClick} />
        );
    }
}

export default Pieces;
