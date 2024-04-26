import {type ReactElement} from 'react';
import {RouterProvider, createHashRouter} from 'react-router-dom';
import {Signup} from './auth/Signup';

type Routes = {
	path: string;
	element: ReactElement;
};

const routes: Routes[] = [
	{
		path: '/',
		element: <Signup/>,
	},
];

const router = createHashRouter(routes);

export function App() {
	return <RouterProvider router={router}/>;
}
