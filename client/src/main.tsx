import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App.tsx';
import {getLightMode} from './context/LightModeContext.tsx';

document.documentElement.className = getLightMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
