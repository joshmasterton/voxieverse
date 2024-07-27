import { useRouteError } from 'react-router-dom';
import '../../style/comp/Error.comp.scss';

export const Error = () => {
  const error = useRouteError() as { status: string; statusText: string };

  console.log(error);

  return (
    <div id="error">
      <div>
        <header>
          <h1>404</h1>
        </header>
        <main>
          <div>Error</div>
        </main>
      </div>
    </div>
  );
};
