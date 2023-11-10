import { title } from 'process';
import GenericList from '../../../components/misc/GenericList';
import { formatDate } from '../../../utils/helpersAdmin';

interface EditInterface {
	Card: any;
	allCards: any;
	id: number | null;
}

const DetailCardComponent = ({ Card, id, allCards }: EditInterface) => {
	const desiredCurrencyCodeEntityObject: any = allCards.find(
		(item: any) => item.id === id,
	);
	return (
		<>
			<GenericList
				header={{ title: `Detalles de tarjeta ${id}` }}
				body={{
					Nombre: desiredCurrencyCodeEntityObject?.holder?.fullName,
					'Creada por': '>????????</',
					'Fecha de emisión': formatDate(Card?.data.createdAt),
					'Fecha de expiración': formatDate(
						desiredCurrencyCodeEntityObject?.expiratedAt,
					),
					Propietario: '********',
					Cuenta: '******',
					Moneda: desiredCurrencyCodeEntityObject?.currency?.name,
					'Monto mínimo sin confirmar':
						desiredCurrencyCodeEntityObject?.minAmountWithoutConfirmation,
					Descripción:
						desiredCurrencyCodeEntityObject?.minAmountWithoutConfirmation,
				}}
			></GenericList>
		</>
	);
};

export default DetailCardComponent;
