import {type ReactElement} from 'react';
import {RouterProvider, createHashRouter} from 'react-router-dom';
import {Popup, PopupProvider} from './context/PopupContext';
import {UserProvider} from './context/UserContext';
import {LightModeProvider} from './context/LightModeContext';
import {Posts} from './pages/Posts';
import {PostPage} from './pages/PostPage';
import {AddPost} from './pages/AddPost';
import {Login} from './auth/Login';
import {Profile} from './pages/Profile';
import {Signup} from './auth/Signup';
import {Friends} from './pages/Friends';
import {FindUsers} from './pages/FindUsers';
import {Error} from './pages/Error';
import {ForgottenPassword} from './auth/ForgottenPassword';
import './assets/var.scss';

type Routes = {
	path: string;
	element: ReactElement;
	errorElement: ReactElement;
};

const routes: Routes[] = [
	{
		path: '/*',
		element: <Posts/>,
		errorElement: <Error/>,
	},
	{
		path: '/post/:postId',
		element: <PostPage/>,
		errorElement: <Error/>,
	},
	{
		path: '/friends',
		element: <Friends/>,
		errorElement: <Error/>,
	},
	{
		path: '/findUser',
		element: <FindUsers/>,
		errorElement: <Error/>,
	},
	{
		path: '/addPost',
		element: <AddPost/>,
		errorElement: <Error/>,
	},
	{
		path: '/profile/:username',
		element: <Profile/>,
		errorElement: <Error/>,
	},
	{
		path: '/login',
		element: <Login/>,
		errorElement: <Error/>,
	},
	{
		path: '/signup',
		element: <Signup/>,
		errorElement: <Error/>,
	},
	{
		path: '/forgottenPassword',
		element: <ForgottenPassword/>,
		errorElement: <Error/>,
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
