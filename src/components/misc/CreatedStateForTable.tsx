import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/20/solid';

interface StateSpanProp {
	currentState: string;
	greenState: string;
	redState: string;
}

const CreatedStateForTable = ({
	currentState,
	greenState,
	redState,
}: StateSpanProp) => {
	return currentState == 'CREATED' ? (
		<span className='py-1 px-2 rounded-full h-10 bg-green-200 text-green-700 font-semibold text-center'>
			{greenState}
		</span>
	) : (
		<span className='py-1 px-2 rounded-full bg-red-200 text-red-700 font-semibold text-center'>
			{redState}
		</span>
	);
};

export default CreatedStateForTable;
