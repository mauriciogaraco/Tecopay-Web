import React from 'react';

interface StateSpanProp {
	currentState: String | Boolean;
	greenState: string;
	redState: string;
}

const StateSpanForTable = ({
	currentState,
	greenState,
	redState,
}: StateSpanProp) => {
	return typeof currentState == 'boolean' ? (
		currentState === true ? (
			<span className='py-1 px-2 rounded-full h-10 bg-green-200 text-green-700 font-semibold text-center'>
				{greenState}
			</span>
		) : (
			<span className='py-1 px-2 rounded-full bg-red-200 text-red-700 font-semibold text-center'>
				{redState}
			</span>
		)
	) : currentState === 'Activa' ? (
		<span className='py-1 px-2 rounded-full h-10 bg-green-200 text-green-700 font-semibold text-center'>
			{greenState}
		</span>
	) : (
		<span className='py-1 px-2 rounded-full bg-red-200 text-red-700 font-semibold text-center'>
			{redState}
		</span>
	);
};

export default StateSpanForTable;
