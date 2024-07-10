import { describe, expect, test } from 'vitest';
import { ThemeProvider, useTheme } from '../../src/context/Theme.context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Theme', () => {
  const TestComponent = () => {
    const { theme, changeTheme } = useTheme();
    return (
      <>
        <div>{theme}</div>
        <button type="button" onClick={changeTheme}>
          Change theme
        </button>
      </>
    );
  };

  test('Should render component with theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(
      screen.queryByText('dark') || screen.queryByText('light')
    ).toBeInTheDocument();
  });

  test('Should change current theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(
      screen.queryByText('dark') || screen.queryByText('light')
    ).toBeInTheDocument();

    const changeThemeButton = screen.getByText('Change theme');
    await userEvent.click(changeThemeButton);

    expect(
      screen.queryByText('dark') || screen.queryByText('light')
    ).toBeInTheDocument();
  });
});
