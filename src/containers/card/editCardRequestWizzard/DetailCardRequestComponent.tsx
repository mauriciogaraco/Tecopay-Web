import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import { useState } from 'react';
import { deleteUndefinedAttr, writeDataToFile } from '../../../utils/helpers';
import { BasicType } from '../../../interfaces/InterfacesLocal';
import useServerCardsRequests from '../../../api/userServerCardsRequests';
import Input from '../../../components/forms/Input';
import ChangeStateContainer from './ChangeStateContainer';
import ExcelFileExport from '../../../components/commos/ExcelFileExport';
import { BsFiletypeJson } from 'react-icons/bs';

interface EditInterface {
	editCardRequest: Function;
	deleteCardRequest: Function;
	closeModal: Function;
	isFetching: boolean;
	id: number | null;
	allCardsRequests: any;
	setSelectedDataToParent: any;
	updateCardStatus: Function;
}

const DetailCardRequestComponent = ({
	editCardRequest,
	deleteCardRequest,
	closeModal,
	isFetching,
	id,
	allCardsRequests,
	updateCardStatus,
}: EditInterface) => {
	const cardRequest: any = allCardsRequests.find((item: any) => item.id === id);
	const { control, handleSubmit, reset } = useForm();
	const [delAction, setDelAction] = useState(false);
	const [changeState, setChangeState] = useState(false);
	const [exportModal, setExportModal] = useState(false);

	let dataToSend: any;

	const exportAction = async (name: string) => {
		const data = cardRequest;
		writeDataToFile(data, name);
	};

	const onSubmit: SubmitHandler<BasicType> = (data) => {
		if (data.priority === 'Expresa') {
			dataToSend = { ...data, priority: 'EXPRESS' };
		}
		if (data.priority === 'Normal') {
			dataToSend = { ...data, priority: 'NORMAL' };
		}
		editCardRequest(id, deleteUndefinedAttr(dataToSend ?? []), reset()).then(() =>
			closeModal(),
		);
	};

	console.log({ cardRequest })

	const { isLoading } = useServerCardsRequests();

	const priorityData = [
		{ id: 1, name: 'Normal', code: "NORMAL" },
		{ id: 2, name: 'Expresa', code: "EXPRESS" },
	]

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
								label='Nombre del propietario'
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
							defaultValue={priorityData.find(priority => priority.code === cardRequest?.priority)?.name}
							// default={cardRequest?.priority}
							control={control}
							name='priority'
							label='Prioridad'
							data={priorityData}
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

					{
						cardRequest.status !== "PRINTED" && (
							<div className='flex self-end'>
								<Button
									name='Actualizar'
									color='slate-600'
									type='submit'
									loading={isLoading}
								/>
							</div>
						)
					}

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
					// loading={loadingExport}
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
