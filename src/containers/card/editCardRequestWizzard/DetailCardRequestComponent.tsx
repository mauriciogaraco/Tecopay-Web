import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { formatDate } from '../../../utils/helpersAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';
import CardRequests from '../CardRequests';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import { useState } from 'react';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import { BasicType } from '../../../interfaces/InterfacesLocal';
import useServerCardsRequests from '../../../api/userServerCardsRequests';

interface EditInterface {
	cardRequest: any;
	editCardRequest: Function;
	deleteCardRequest: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCardsRequests: any;
	setSelectedDataToParent: any;
}

const DetailCardRequestComponent = ({
	editCardRequest,
	deleteCardRequest,
	cardRequest,
	closeModal,
	isFetching,
	id,
	allCardsRequests,
	setSelectedDataToParent,
}: EditInterface) => {
	const desiredCurrencyCodeEntityObject: any = allCardsRequests.find(
		(item: any) => item.id === id,
	);
	const { control, handleSubmit, reset } = useForm();
	const [delAction, setDelAction] = useState(false);

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		const WholeData = Object.assign(data, {
			userId: 1,
			issueEntityId: cardRequest?.data.issueEntityId,
			cardId: cardRequest?.data.cardID,
			holderName: cardRequest?.data.holderName,
		});
		editCardRequest(
			cardRequest?.data.id,
			deleteUndefinedAttr(WholeData),
			reset(),
		).then(() => closeModal());
	};
	const { isLoading } = useServerCardsRequests();
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section className='flex relative flex-col'>
					<div className='py-3 absolute right-0'>
						{' '}
						<Button
							icon={<TrashIcon className='h-5 text-red-500' />}
							color='gray-50'
							type='button'
							action={() => {
								setDelAction(true);
							}}
							outline
						/>
					</div>
					<ul className='grid py-3 gap-3 text-xl'>
						<li className=' pl-2 rounded-m '>
							Propietario: <span>{cardRequest?.data?.holderName}</span>
						</li>
						<li className=' pl-2 rounded-m '>
							Cantidad: <span>????????</span>
						</li>
					</ul>
					<div className=' flex flex-col my-3 gap-3'>
						<Select
							defaultValue={cardRequest?.data.priority}
							default={cardRequest?.data.priority}
							control={control}
							name='priority'
							label='Prioridad'
							data={[
								{ id: 1, name: 'NORMAL' },
								{ id: 2, name: 'EXPRESS' },
							]}
						></Select>
						<Select
							defaultValue={
								cardRequest?.data.status == 'CREATED' ? 'CREADA' : 'En Proceso'
							}
							default={
								cardRequest?.data.status == 'CREATED' ? 'CREADA' : 'En Proceso'
							}
							control={control}
							name='status'
							label='Estado'
							data={[
								{ id: 1, name: 'En Proceso' },
								{ id: 2, name: 'CREADA' },
							]}
						></Select>
					</div>

					<div className='h-full'>
						<TextArea
							name='observations'
							defaultValue={cardRequest?.data?.observations}
							rules={{ required: 'Campo requerido' }}
							control={control}
							label='Observaciones'
						></TextArea>
					</div>

					<div className='flex self-end'>
						<Button
							name='Insertar'
							color='slate-600'
							type='submit'
							loading={isLoading}
						/>
					</div>
				</section>
			</form>
			{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => deleteCardRequest(cardRequest?.data.id, closeModal)}
						onCancel={setDelAction}
						title={`Eliminar solicitud ${cardRequest?.data.id}`}
						text='¿Seguro que desea eliminar esta solicitud del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}
		</>
	);
};

export default DetailCardRequestComponent;
