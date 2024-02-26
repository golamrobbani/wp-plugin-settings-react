/**
 * Admin Settings Page
 */

// Imports
import ReactDOM from 'react-dom/client';
import App from './admin/components/app';
import { StateProvider } from './admin/utils/StateProvider';
import reducer, { initialState } from './admin/utils/reducer';

// Container
const container = document.getElementById('rtsb-admin-app');

// Root
const root = ReactDOM.createRoot(container);

// Render
root.render(
	<StateProvider reducer={reducer} initialState={initialState}>
		<App />
	</StateProvider>
);
