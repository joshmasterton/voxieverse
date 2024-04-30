import {type ReactElement} from 'react';
import {RouterProvider, createHashRouter} from 'react-router-dom';
import {Popup, PopupProvider} from './context/Popup';
import {UserProvider} from './context/UserContext';
import {LightModeProvider} from './context/LightModeContext';
import {Posts} from './pages/Posts';
import {Login} from './auth/Login';
import {Signup} from './auth/Signup';
import {ForgottenPassword} from './auth/ForgottenPassword';
import './assets/var.scss';

type Routes = {
	path: string;
	element: ReactElement;
};

const routes: Routes[] = [
	{
		path: '/login',
		element: <Login/>,
	},
	{
		path: '/signup',
		element: <Signup/>,
	},
	{
		path: '/forgottenPassword',
		element: <ForgottenPassword/>,
	},
	{
		path: '/',
		element: <Posts/>,
	},
];

const router = createHashRouter(routes);

export function App() {
	return (
		<LightModeProvider>
			<PopupProvider>
				<UserProvider>
					<Popup/>
					<RouterProvider router={router}/>
				</UserProvider>
			</PopupProvider>
		</LightModeProvider>
	);
}
