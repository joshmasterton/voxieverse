import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Button } from '../../src/comp/Button';
import { BiTestTube } from 'react-icons/bi';

describe('Button', () => {
  test('Should render button', () => {
    render(
      <Button
        type="button"
        label="test"
        onClick={() => {}}
        className="buttonTest"
        name="Test"
        SVG={<BiTestTube />}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Test')).toBeInTheDocument();
  });

  test('Should render button without name and svg', () => {
    render(
      <Button
        type="button"
        onClick={() => {}}
        label="test"
        className="buttonTest"
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
