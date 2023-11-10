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
			<section>
				<ul className='grid py-3 gap-3 text-xl'>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						No. Tarjeta: {Card?.data?.id}
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Nombre:{''}
						<span>{desiredCurrencyCodeEntityObject?.holder?.fullName}</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Creada por: <span>????????</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Fecha de emisión: <span>{formatDate(Card?.data.createdAt)}</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Fecha de expiración:{' '}
						<span>
							{formatDate(desiredCurrencyCodeEntityObject?.expiratedAt)}
						</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Propietario: <span>????????</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Cuenta: <span>????????</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Moneda:{' '}
						<span>{desiredCurrencyCodeEntityObject?.currency?.name}</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Monto mínimo sin confirmar:{' '}
						<span>
							{desiredCurrencyCodeEntityObject?.minAmountWithoutConfirmation}
						</span>
					</li>
					<li className='border pl-2 rounded-md border-tecopay-800 '>
						Descripción: <span>{Card?.data.description}</span>
					</li>
				</ul>
			</section>
		</>
	);
};

export default DetailCardComponent;
