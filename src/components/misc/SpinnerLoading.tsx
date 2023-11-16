import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Spinner {
	text?: string;
}

const SpinnerLoading = ({ text }: Spinner) => {
	return (
		<div className='text-center mt-5'>
			<FontAwesomeIcon
				icon={faSpinner}
				className='h-10 w-10 animate-spin text-tecopay-600'
				aria-hidden='true'
			/>
			<h3 className='text-sm font-medium text-gray-600 mt-3 animate-pulse'>
				{text ? text : 'Cargando...'}
			</h3>
		</div>
	);
};

export default SpinnerLoading;
