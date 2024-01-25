import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import { translateOrderState } from '../../../utils/translate';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';


interface propsDestructured {
	CRUD: any;
	id: number;
	close: Function;
}

const contextData: any = {};
export const ProductContext = createContext(contextData);


const EditCardRequest = ({ CRUD, id, close }: propsDestructured) => {

	const cardRequest: any = CRUD.allCardsRequests.find((item: any) => item.id === id);
	const [delAction, setDelAction] = useState(false);
	const [selectedToParent, setSelectedToParent] = useState();
	const isDisabled = selectedToParent === 'Denegada';

	const { control, handleSubmit, formState: { errors }, reset } = useForm<Record<string, string | number>>();

	let dataCardStatus: any;
	let dataToSend: any;

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {

		if (dataToSubmit.status === 'Aceptada') {
			dataToSend = { status: 'ACCEPTED' };
		} else if (dataToSubmit.status === 'Impresa') {
			dataToSend = { status: 'PRINTED' };
		} else {
			dataToSend = { status: 'DENIED' };
		}

		CRUD.updateCardStatus(id, deleteUndefinedAttr(dataToSend), () => { });

		if (dataToSubmit.priority === 'Expresa') {
			dataCardStatus = { ...dataToSubmit, priority: 'EXPRESS' };
		}
		if (dataToSubmit.priority === 'Normal') {
			dataCardStatus = { ...dataToSubmit, priority: 'NORMAL' };
		}

		CRUD.editCardRequest(id, deleteUndefinedAttr(dataCardStatus ?? []), () => { });

		close();
	};
	console.log(id);
	console.log(cardRequest);
	const priorityData = [
		{ id: 1, name: 'Normal', code: "NORMAL" },
		{ id: 2, name: 'Expresa', code: "EXPRESS" },
	]

	return (
		<>
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-4">
				{cardRequest?.quantity === 1 && (
					<Input
						label='Nombre del propietario'
						name='holderName'
						defaultValue={cardRequest?.holderName ?? '-'}
						control={control}
					></Input>
				)}
				<div className="flex gap-4">
					<div className="w-1/2">
						<Select
							defaultValue={priorityData?.find((priority: any) => priority.code === cardRequest?.priority)?.name}
							control={control}
							name='priority'
							label='Prioridad'
							data={priorityData}
						></Select>
					</div>
					<div className="w-1/2">
						<Select
							defaultValue={translateOrderState(cardRequest?.status) ?? ''}
							control={control}
							setSelectedToParent={setSelectedToParent}
							name='status'
							label='Estado'
							disabled={isDisabled}
							data={[
								{ id: 1, name: translateOrderState('PRINTED') },
								{ id: 2, name: translateOrderState('ACCEPTED') },
								{ id: 3, name: translateOrderState('DENIED') },
								{ id: 4, name: translateOrderState('REQUESTED') },
							]}
						/>
					</div>
				</div>
				{cardRequest?.quantity > 1 && (
					<li className=' pl-2 rounded-m '>
						Cantidad: <span>{cardRequest?.quantity}</span>
					</li>
				)}
				<TextArea
					name='observations'
					defaultValue={cardRequest?.observations}
					rules={{ required: 'Campo requerido' }}
					control={control}
					label='Observaciones'
				></TextArea>
				{
					(cardRequest?.status !== "REQUESTED" && cardRequest?.status !== "DENIED")
					&& (
						<div className='h-full w-1/2' >
							<Input
								name='barCode'
								defaultValue={cardRequest?.card[0]?.barCode!}
								rules={{ required: 'Campo requerido' }}
								control={control}
								label='Código de barras'
								disabled={true}
							></Input>
						</div>
					)}
				{
					cardRequest?.status !== "PRINTED" && (
						<div className="flex justify-between">
							<Button
								color="slate-500"
								action={() => {
									setDelAction(true);
								}}
								name="Eliminar tarjeta"
								outline
								textColor="text-red-500"
								iconAfter={<TrashIcon className='text-red-500  w-4 h-4' />}
								type={'button'}
							/>
							<Button
								name='Actualizar'
								color='slate-600'
								type='submit'
								loading={CRUD.isLoading}
							/>
						</div>
					)
				}
			</div>
		</form>
		{delAction && (
				<Modal state={delAction} close={setDelAction}>
					<AlertContainer
						onAction={() => CRUD.deleteCardRequest(id, close)}
						onCancel={setDelAction}
						title={`Eliminar tarjeta ${cardRequest.queryNumber}`}
						text='¿Seguro que desea eliminar esta tarjeta del sistema?'
						loading={CRUD.isFetching}
					/>
				</Modal>
			)}
		</>
	);
};

export default EditCardRequest;


