import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { formatCalendar } from '../../../utils/helpersAdmin';
import { SubmitHandler, useForm } from 'react-hook-form';
import CardRequests from '../CardRequests';
import { TicketIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import { useState } from 'react';
import { deleteUndefinedAttr, writeDataToFile } from '../../../utils/helpers';
import { BasicType } from '../../../interfaces/InterfacesLocal';
import useServerCardsRequests from '../../../api/userServerCardsRequests';
import AcceptContainer from '../../../components/misc/AcceptContainer';
import { CheckIcon } from '@heroicons/react/24/solid';
import Input from '../../../components/forms/Input';
import ChangeStateContainer from './ChangeStateContainer';
import ExcelFileExport from '../../../components/commos/ExcelFileExport';
import { BsFiletypeJson, BsFiletypeXlsx } from 'react-icons/bs';

interface EditInterface {
	editCardRequest: Function;
	deleteCardRequest: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCardsRequests: any;
	setSelectedDataToParent: any;
	acceptRequest: Function;
	updateCardStatus: Function;
}

const DetailCardRequestComponent = ({
	editCardRequest,
	deleteCardRequest,
	closeModal,
	isFetching,
	id,
	allCardsRequests,
	acceptRequest,
	updateCardStatus,
}: EditInterface) => {
	const cardRequest: any = allCardsRequests.find((item: any) => item.id === id);
	const { control, handleSubmit, reset } = useForm();
	const [delAction, setDelAction] = useState(false);
	const [changeState, setChangeState] = useState(false);
	const [exportModal, setExportModal] = useState(false);
	const [loadingExport, setloadingExport] = useState(false);

	const [acceptRequestModal, setAcceptRequestModal] = useState(false);

	let dataToSend: any;

	const exportAction = async (name: string) => {
		const data = cardRequest;
		writeDataToFile(data, name);
	};

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		if (data.priority == 'Expresa') {
			dataToSend = { ...data, priority: 'EXPRESS' };
		}
		if (data.priority == 'Normal') {
			dataToSend = { ...data, priority: 'NORMAL' };
		}
		editCardRequest(id, deleteUndefinedAttr(dataToSend), reset()).then(() =>
			closeModal(),
		);
	};

	const { isLoading } = useServerCardsRequests();
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section className='flex relative flex-col'>
					<div className='py-3 relative '>
						<div className='flex justify-between gap-5'>
							{cardRequest?.status === 'PRINTED' ||
							cardRequest?.status === 'DENIED' ? null : (
								<Button
									textColor='gray-900'
									name='Cambiar Estado'
									color='tecopay-200'
									type='button'
									action={() => {
										setChangeState(true);
									}}
									outline
								/>
							)}

							<div className='flex gap-5'>
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
							{
								<Button
									icon={<BsFiletypeJson className='h-5' />}
									color='gray-50'
									textColor='gray-900'
									type='button'
									name='Exportar como Json'
									action={() => {
										setExportModal(true);
									}}
									outline
								/>
							}
						</div>
					</div>
					<ul className='grid py-3 gap-3 text-xl'>
						{cardRequest?.quantity === 1 && (
							<Input
								name='holderName'
								defaultValue={cardRequest?.holderName ?? '-'}
								control={control}
							></Input>
						)}
						{cardRequest?.quantity > 1 && (
							<li className=' pl-2 rounded-m '>
								Cantidad: <span>{cardRequest?.quantity}</span>
							</li>
						)}
					</ul>
					<div className=' flex flex-col my-3 gap-3'>
						<Select
							defaultValue={cardRequest?.priority}
							default={cardRequest?.priority}
							control={control}
							name='priority'
							label='Prioridad'
							data={[
								{ id: 1, name: 'Normal' },
								{ id: 2, name: 'Expresa' },
							]}
						></Select>
					</div>

					<div className='h-full'>
						<TextArea
							name='observations'
							defaultValue={cardRequest?.observations}
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
						onAction={() => deleteCardRequest(id)}
						onCancel={setDelAction}
						title={`Eliminar solicitud ${id}`}
						text='¿Seguro que desea eliminar esta solicitud del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)}

			{changeState && (
				<Modal state={changeState} close={setChangeState}>
					<ChangeStateContainer
						isLoading={isFetching}
						cardRequest={cardRequest}
						closeModal={closeModal}
						id={id}
						updateCardStatus={updateCardStatus}
					></ChangeStateContainer>
				</Modal>
			)}

			{exportModal && (
				<Modal state={exportModal} close={setExportModal}>
					<ExcelFileExport
						exportAction={exportAction}
						loading={loadingExport}
					/>
				</Modal>
			)}
			{/*acceptRequestModal && (
				<Modal state={acceptRequestModal} close={setAcceptRequestModal}>
					<AcceptContainer
						onAction={() => acceptRequest(id, { requestId: id })}
						onCancel={setAcceptRequestModal}
						title={`Aceptar solicitud ${id}`}
						text='¿Seguro que desea aceptar esta solicitud del sistema?'
						loading={isFetching}
					/>
				</Modal>
			)*/}
		</>
	);
};

export default DetailCardRequestComponent;
