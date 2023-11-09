import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/20/solid';

interface StateSpanProp {
	currentState: boolean;
}

const BlockedStateForTable = ({ currentState }: StateSpanProp) => {
	return currentState == false ? (
		<div className='py-1 px-2 w-full flex items-center justify-center rounded-full text-green-700 font-semibold text-center'>
			<LockOpenIcon className='w-4 h-4'></LockOpenIcon>
		</div>
	) : (
		<div className='py-1 px-2 w-full flex items-center justify-center rounded-full text-red-700 font-semibold text-center'>
			<LockClosedIcon className='w-4 h-4'></LockClosedIcon>
		</div>
	);
};

export default BlockedStateForTable;
