import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';

describe('Minimal Hook Test', () => {
  function TestComponent() {
    const [count, setCount] = useState(0);
    return (
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    );
  }

  it('renders and updates state', () => {
    render(<TestComponent />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('0');
    button.click();
    expect(button).toHaveTextContent('1');
  });
}); 