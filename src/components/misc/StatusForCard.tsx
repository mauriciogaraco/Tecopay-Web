interface StateSpanProp {
	currentState: boolean;
}

const StatusForCard = ({ currentState }: StateSpanProp) => {
	let color, text;
	switch (currentState) {
		case true:
			color = 'green';
			text = "Entregada";
			break;
		case false:
			color = 'red';
			text = 'Pendiente';
			break;

		default:
			color = 'gray';
			text = 'Unknown';
	}
	return (
		<span
			className={`py-1 px-2 rounded-full  h-10 bg-${color}-200 text-${color}-700 font-semibold text-center`}
		>
			{text}
		</span>
	);
};

export default StatusForCard;
