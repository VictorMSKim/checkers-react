import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import Square from './Square';

it('renders without crashing', () => {
    const {getByTestId} = render(<Square />)
    expect(getByTestId("squares")).toBeInTheDocument();
})