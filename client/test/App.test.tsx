import React from 'react';
import { App } from '../src/App';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  test('App', () => {
    render(<App />);
    expect(screen.getByText('Voxieverse')).toBeInTheDocument();
  });
});
