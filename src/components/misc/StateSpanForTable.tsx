import React from 'react';
import { RiZzzFill } from 'react-icons/ri';

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
		currentState === true ? null : (
			<span className=' rounded-full text-gray-700 font-semibold text-center'>
				<RiZzzFill />
			</span>
		)
	) : currentState === 'Activa' ? null : (
		<span className=' rounded-full  text-gray-700 font-semibold text-center'>
			<RiZzzFill />
		</span>
	);
};

export default StateSpanForTable;
