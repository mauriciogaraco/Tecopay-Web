import { title } from 'process';
import GenericList from '../../../components/misc/GenericList';
import { formatDate } from '../../../utils/helpersAdmin';
import { useEffect } from 'react';
import { formatCardNumber } from '../../../utils/helpers';

interface EditInterface {
	allCards: any;
	id: number | null;
}

const DetailCardComponent = ({ id, allCards }: EditInterface) => {
	const desiredObject: any = allCards.find((item: any) => item.id === id);
	return (
		<>
			<GenericList
				header={{ title: `Detalles de tarjeta ${id}` }}
				body={{
					'No. Tarjeta': formatCardNumber(desiredObject?.address) ?? '-',
					Nombre: desiredObject?.holderName ?? '-',
					'Creada por': desiredObject?.issueEntity ?? '-',
					'Fecha de emisión': 'No existe',
					'Fecha de expiración': formatDate(desiredObject?.expiratedAt) ?? '-',
					Propietario: 'No existe',
					Cuenta: desiredObject.account.name ?? '-',
					Moneda: desiredObject?.currency ?? '-',
					'Monto mínimo sin confirmar':
						desiredObject?.minAmountWithoutConfirmation ?? '-',
					Descripción: desiredObject?.description ?? '-',
				}}
			></GenericList>
		</>
	);
};

export default DetailCardComponent;
