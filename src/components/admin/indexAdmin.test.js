import React from 'react';
import { render, screen } from '@testing-library/react';
import IndexAdmin from './indexAdmin';

describe("<IndexAdmin />", () => {
  test("renders the IndexAdmin component", () => {
    render(<IndexAdmin />);
    screen.debug();
  });
});