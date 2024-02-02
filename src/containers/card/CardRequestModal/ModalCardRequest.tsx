import { useForm, SubmitHandler } from "react-hook-form";
import { useState, createContext } from "react";
import Select from '../../../components/forms/Select';
import TextArea from '../../../components/forms/TextArea';
import Button from '../../../components/misc/Button';
import { TrashIcon, CheckIcon, NoSymbolIcon,  } from '@heroicons/react/24/outline';
import { deleteUndefinedAttr } from '../../../utils/helpers';
import Input from '../../../components/forms/Input';
import { translateOrderState } from '../../../utils/translate';
import Modal from '../../../components/modals/GenericModal';
import AlertContainer from '../../../components/misc/AlertContainer';
import AsyncComboBox from '../../../components/forms/AsyncCombobox';
import GenericList from '../../../components/misc/GenericList';

interface propsDestructured {
	close: Function;
	CRUD: any;
	id: number
}

interface propsDestructured {
	CRUD: any;
	id: number;
	close: Function;
}

const contextData: any = {};
export const ProductContext = createContext(contextData);


const ModalCardRequest = ({ CRUD, id, close }: propsDestructured) => {

	console.log(id);

	const cardRequest: any = CRUD.allCardsRequests.find((item: any) => item.id === id);
	const [delAction, setDelAction] = useState(false);

	const { control, handleSubmit } = useForm<Record<string, string | number>>();

	let dataCardStatus: any;

	const onSubmit: SubmitHandler<Record<string, string | number | null>> = (dataToSubmit) => {

		if (dataToSubmit.priority === 'Expresa') {
			dataCardStatus = { ...dataToSubmit, priority: 'EXPRESS' };
		}
		if (dataToSubmit.priority === 'Normal') {
			dataCardStatus = { ...dataToSubmit, priority: 'NORMAL' };
		}

		CRUD.editCardRequest(id, deleteUndefinedAttr(dataCardStatus ?? []), () => { });

		close();
	};
	function denied() {
		CRUD.updateCardStatus(id, { status: 'DENIED' }, close);
	}

	function accepted() {
		CRUD.updateCardStatus(id, { status: 'ACCEPTED' }, close);
	}

	const priorityData = [
		{ id: 1, name: 'Normal', code: "NORMAL" },
		{ id: 2, name: 'Expresa', code: "EXPRESS" },
	]

	if (cardRequest?.status === 'PRINTED' || cardRequest?.status === "DENIED") {
		return (
			<>
				<GenericList
					header={{ title: `Detalles de solicitud denegada ${cardRequest?.queryNumber}` }}
					body={{
						'Nombre del propietario': cardRequest?.holderName ?? '-',

						'Prioridad': cardRequest?.priority,

						'Estado': translateOrderState(cardRequest?.status) ?? '',

						'Entidad': cardRequest?.issueEntity?.name ?? '-',

						'Categoría': cardRequest?.category?.name ?? '-',

						'Observaciones': cardRequest?.observations,
					}}
				></GenericList>

			</>
		)
	} else {
		return (
			<>
				<div className="flex">
					<div>
						<p className='mb-4 font-semibold text-lg'>
							Solicitud {cardRequest?.queryNumber}
						</p>
						{cardRequest?.quantity === 1 && (
							<p className='mb-4 font-semibold text-lg'>
								Simple ( cantidad: 1 )
							</p>
						)}
						{cardRequest?.quantity > 1 && (
							<>
								<p className='mb-4 font-semibold text-lg'>
									Por bulto ( cantidad: <span>{cardRequest?.quantity}</span> )
								</p>
							</>
						)}
					</div>
					<div className="flex justify-end items-center grow">
						<div className="mx-10 flex gap-5">
							<Button
								icon={<NoSymbolIcon className='h-5 text-red-600' />}
								color={'red-200'}
								action={() => denied()}
							/>
							{cardRequest?.status === "REQUESTED" && (
								<Button
									icon={<CheckIcon className='h-5 text-green-600' />}
									color={'green-200'}
									action={() => accepted()}
								/>
							)}

						</div>

					</div>
				</div>
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
								<AsyncComboBox
									name='categoryId'
									normalizeData={{ id: 'id', name: 'name' }}
									control={control}
									label='Categoría'
									dataQuery={{ url: `/categories/${cardRequest?.issueEntity?.id}` }}
								></AsyncComboBox>
							</div>
						</div>

						<TextArea
							name='observations'
							defaultValue={cardRequest?.observations}
							rules={{ required: 'Campo requerido' }}
							control={control}
							label='Observaciones'
						></TextArea>

						{
							cardRequest?.status !== "PRINTED" && (
								<div className="flex justify-between">
									<Button
										color="slate-500"
										action={() => {
											setDelAction(true);
										}}
										name="Eliminar solicitud"
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
							title={`Eliminar solicitud ${cardRequest?.queryNumber}`}
							text='¿Seguro que desea eliminar esta solicitud del sistema?'
							loading={CRUD.isFetching}
						/>
					</Modal>
				)}
			</>
		);
	}


};

export default ModalCardRequest;


