import { translateOrderState } from '../../utils/translate';

interface StateSpanProp {
	currentState: string;
}

const StatusForCardRequest = ({ currentState }: StateSpanProp) => {
	let color, text;
	switch (currentState) {
		case 'ACCEPTED':
		case 'CREATED':
		case 'DELIVERED':
			color = 'green';
			text = translateOrderState(currentState);
			break;

		case 'REQUESTED':
		case 'IN_PROCESS':
		case 'MODIFIED':
			color = 'yellow';
			text = translateOrderState(currentState);
			break;
		case 'DENIED':
			color = 'red';
			text = translateOrderState(currentState);
			break;

		default:
			color = 'gray';
			text = 'Unknown';
	}
	return (
		<span
			className={`py-1 px-2 rounded-full h-10 bg-${color}-200 text-${color}-700 font-semibold text-center`}
		>
			{text}
		</span>
	);
};

export default StatusForCardRequest;
