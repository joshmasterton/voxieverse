import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from '../../src/comp/Input';
import { BiTestTube } from 'react-icons/bi';

describe('Input', () => {
  test('Should render input type text', async () => {
    render(
      <Input
        id="test"
        type="text"
        placeholder="Test"
        setValue={() => {}}
        SVG={<BiTestTube />}
      />
    );

    const inputElement = screen.getByLabelText('test') as HTMLInputElement;
    await userEvent.type(inputElement, 'test text');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('test text');
  });

  test('Should accept file upload with correct file type', async () => {
    render(
      <Input id="test" type="file" placeholder="Test" setValue={() => {}} />
    );

    const inputElement = screen.getByLabelText('test') as HTMLInputElement;
    await userEvent.upload(
      inputElement,
      new File([], 'test.jpg', { type: 'image/jpg' })
    );

    expect(screen.queryByText('test.jpg')).toBeInTheDocument();
  });

  test('Should reject file upload with incorrect file type', async () => {
    render(
      <Input id="test" type="file" placeholder="Test" setValue={() => {}} />
    );

    const inputElement = screen.getByLabelText('test') as HTMLInputElement;
    await userEvent.upload(
      inputElement,
      new File([], 'test.jpg', { type: 'text/plain' })
    );

    expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
  });
});
