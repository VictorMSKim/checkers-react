import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import Pieces from './Pieces';

it('renders without crashing', () => {
    const {getByTestId} = render(<Pieces />)
    expect(getByTestId("pieces")).toBeInTheDocument();
})