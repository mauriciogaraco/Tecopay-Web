import LoadingSpin from './LoadingSpin';
import { CheckIcon } from '@heroicons/react/24/solid';

interface AlertInterface {
	title: string;
	text: string;
	onAction: Function;
	onCancel: Function;
	loading?: boolean;
}

const AcceptContainer = ({
	title,
	text,
	onAction,
	onCancel,
	loading,
}: AlertInterface) => {
	return (
		<>
			<div className='sm:flex sm:items-start'>
				<div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10'>
					<CheckIcon className='h-6 w-6 text-green-600' aria-hidden='true' />
				</div>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<h3 className='text-lg font-medium leading-6 text-gray-900'>
						{title}
					</h3>
					<div className='mt-2'>
						<p className='text-sm text-gray-500'>{text}</p>
					</div>
				</div>
			</div>
			<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
				<button
					type='button'
					className='inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-2 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm gap-1'
					onClick={() => onAction()}
					disabled={loading}
				>
					{loading && <LoadingSpin />}
					Continuar
				</button>
				<button
					type='button'
					className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm'
					onClick={() => onCancel(false)}
				>
					{' '}
					Cancelar
				</button>
			</div>
		</>
	);
};

export default AcceptContainer;
