import React from 'react';
import '@testing-library/jest-dom';
import GameBoard from './GameBoard';
import { render, fireEvent, waitForElement, waitForDomChange } from '@testing-library/react';

test('renders the gameboard', () => {
    const {getByTestId} = render(<GameBoard />)
    expect(getByTestId("board")).toBeInTheDocument();
})

test('renders a square', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const square = getAllByTestId("squares")[1]
    expect(square).toBeInTheDocument();
})

test('renders another square', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const square = getAllByTestId("squares")[60]
    expect(square).toBeInTheDocument();
})

test('render piece', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const piece = getAllByTestId("pieces")[0]
    expect(piece).toBeInTheDocument();
})

test('render a red piece', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const piece = getAllByTestId("pieces")[0]
    expect(piece).toHaveClass('red');
})

test('render a black piece', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const piece = getAllByTestId("pieces")[1]
    expect(piece).toHaveClass('black');
})

test('highlights board', () => {
    const {getAllByTestId} = render(<GameBoard />)
    const piece = getAllByTestId("pieces")[1]
    fireEvent.click(piece)
    expect(piece).toHaveClass('black')
    expect(piece.parentElement).toHaveClass('highlight')
    const square = getAllByTestId("squares")[12]
    expect(square).toHaveClass('highlight')
})

test('moving piece', async() => {
    const {getAllByTestId} = render(<GameBoard />)
    const piece = getAllByTestId("pieces")[1]
    const square = getAllByTestId("squares")[12]
    fireEvent.click(piece)
    fireEvent.click(square)
})
