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
import {ForgottenPassword} from './auth/ForgottenPassword';
import './assets/var.scss';

type Routes = {
	path: string;
	element: ReactElement;
};

const routes: Routes[] = [
	{
		path: '/*',
		element: <Posts/>,
	},
	{
		path: '/post/:postId',
		element: <PostPage/>,
	},
	{
		path: '/friends',
		element: <Friends/>,
	},
	{
		path: '/findUser',
		element: <FindUsers/>,
	},
	{
		path: '/addPost',
		element: <AddPost/>,
	},
	{
		path: '/profile/:username',
		element: <Profile/>,
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
