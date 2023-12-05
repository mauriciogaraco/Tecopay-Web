import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../forms/Input';
import Button from '../misc/Button';

const ExcelFileExport = ({
	exportAction,
	loading,
}: {
	exportAction: (name: string) => void;
	loading?: boolean;
}) => {
	const { control, handleSubmit } = useForm();
	const submit: SubmitHandler<Record<string, string>> = (data) => {
		exportAction(data.name);
	};
	return (
		<form onSubmit={handleSubmit(submit)}>
			<Input
				name='name'
				control={control}
				label='Nombre del archivo'
				rules={{ required: 'Requerido *' }}
			/>
			<div className='flex justify-end py-2'>
				<Button
					color='slate-600'
					name='Aceptar'
					type='submit'
					loading={!!loading}
					disabled={!!loading}
				/>
			</div>
		</form>
	);
};

export default ExcelFileExport;
