import {type ReactElement} from 'react';
import {RouterProvider, createHashRouter} from 'react-router-dom';
import {Popup, PopupProvider} from './context/PopupContext';
import {UserProvider} from './context/UserContext';
import {LightModeProvider} from './context/LightModeContext';
import {Posts} from './pages/Posts';
import {AddPost} from './pages/AddPost';
import {Login} from './auth/Login';
import {Profile} from './pages/Profile';
import {Signup} from './auth/Signup';
import {Users} from './pages/Users';
import {ForgottenPassword} from './auth/ForgottenPassword';
import './assets/var.scss';

type Routes = {
	path: string;
	element: ReactElement;
};

const routes: Routes[] = [
	{
		path: '/',
		element: <Posts/>,
	},
	{
		path: '/users',
		element: <Users/>,
	},
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
		path: '/addPost',
		element: <AddPost/>,
	},
	{
		path: '/profile/:username',
		element: <Profile/>,
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
