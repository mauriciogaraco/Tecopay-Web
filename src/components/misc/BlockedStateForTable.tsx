import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/20/solid';

interface StateSpanProp {
	currentState: boolean;
}

const BlockedStateForTable = ({ currentState }: StateSpanProp) => {
	return currentState == false ? null : (
		<span className=' w-4 flex items-center justify-center text-tecopay-700 font-semibold text-center'>
			<LockClosedIcon className=' h-4'></LockClosedIcon>
		</span>
	);
};

export default BlockedStateForTable;
