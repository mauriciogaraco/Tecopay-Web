import { title } from 'process';
import GenericList from '../../../components/misc/GenericList';
import { formatDate } from '../../../utils/helpersAdmin';
import { useEffect, useState } from 'react';
import { deleteUndefinedAttr, formatCardNumber } from '../../../utils/helpers';
import Button from '../../../components/misc/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import { BasicType } from '../../../interfaces/InterfacesLocal';
import { SubmitHandler, useForm } from 'react-hook-form';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';

interface EditInterface {
	allCards: any;
	id: number | null;
	deliverCard: Function;
}

const DetailCardComponent = ({ id, allCards, deliverCard }: EditInterface) => {
	const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
		{
			mode: 'onChange',
		},
	);
	const closeModal = () => {
		setDeliver(false);
	};
	const [deliver, setDeliver] = useState(false);
	const desiredObject: any = allCards.find((item: any) => item.id === id);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		console.log(data, id);
		deliverCard(id, deleteUndefinedAttr(data), reset()).then(() =>
			closeModal(),
		);
	};
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
					Cuenta: desiredObject.account.address ?? '-',
					Moneda: desiredObject?.account.currency ?? '-',
					'Monto mínimo sin confirmar':
						desiredObject?.minAmountWithoutConfirmation ?? '-',
					Descripción: desiredObject?.description ?? '-',
				}}
			></GenericList>
			<div className=' flex justify-end mt-3 transition-all duration-200 ease-in-out  rounded-lg'>
				<Button
					name='Entregar a un usuario'
					textColor='gray-900'
					color='green-100'
					type='button'
					action={() => {
						setDeliver(true);
					}}
					outline
				/>
			</div>

			{deliver && (
				<Modal state={deliver} close={setDeliver}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<AsyncComboBox
							name='ownerId'
							normalizeData={{ id: 'id', name: 'fullName' }}
							control={control}
							label='Usuario a entregar'
							dataQuery={{ url: '/user' }}
						/>
						<div className='flex justify-end mt-5'>
							<Button name='Insertar' color='slate-600' type='submit' />
						</div>
					</form>
				</Modal>
			)}
		</>
	);
};

export default DetailCardComponent;
