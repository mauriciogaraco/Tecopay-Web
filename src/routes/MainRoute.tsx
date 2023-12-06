import { BrowserRouter } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import AuthRoute from './AuthRoute';
import AppRoute from './AppRoute';
import { ToastContainer, Flip } from 'react-toastify';

export const MainRoute = () => {
	const { key } = useAppSelector((state) => state.session);

	return (
		<BrowserRouter>
			<ToastContainer
				position='top-center'
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover={true}
				theme='light'
				transition={Flip}
			/>
			{key ? <AppRoute /> : <AuthRoute />}
		</BrowserRouter>
	);
};
