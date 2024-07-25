import { useRouteError } from 'react-router-dom';
import { Navigate } from '../Navigate.comp';
import '../../style/comp/Error.comp.scss';

export const Error = () => {
  const error = useRouteError() as { status: string; statusText: string };

  console.log(error);

  return (
    <div id="error">
      <div>
        <header>
          <h1>{error.status}</h1>
        </header>
        <main>
          <div>{error.statusText}</div>
        </main>
        <footer>
          <Navigate
            to=".."
            onClick={() => {}}
            name="Okay"
            className="buttonPrimary"
          />
        </footer>
      </div>
    </div>
  );
};
