import { createMemoryRouter } from 'react-router-dom';
import { routes } from '../src/App';

export const createTestRouter = (initalEntry: string) => {
  return createMemoryRouter(routes, { initialEntries: [initalEntry] });
};
