import { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import {
	useController,
	type UseControllerProps,
	useForm,
} from 'react-hook-form';
import { useAppSelector } from '../../store/hooks';

interface InputProps {
	label: string;
	placeholder?: string;
	currencies: string[];
	showInline?: boolean;
	disabled?: boolean;
}

const CurrencyInput = (props: UseControllerProps & InputProps) => {
	const { label, placeholder, currencies, showInline, disabled } = props;
	const { field, fieldState } = useController(props);

	const [input, setInput] = useState<{
		price?: number | string;
		codeCurrency?: string;
	}>(props.defaultValue ?? { price: '', codeCurrency: 'CUP' });

	return (
		<div
			className={`${
				showInline ? 'inline-flex items-center ' : 'flex-col'
			} py-2`}
		>
			<label
				htmlFor={label}
				className='block text-sm font-medium text-gray-700'
			>
				{label}
			</label>
			<div className='relative mt-1 rounded-md shadow-sm'>
				<input
					type='number'
					min={0}
					step={0.01}
					className={`${
						fieldState.error
							? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
							: 'focus:ring-gray-500 border-gray-500 focus:border-gray-600 text-gray-500'
					} block w-full rounded-md  pr-10 sm:text-sm placeholder:text-slate-400`}
					value={input.price}
					placeholder={placeholder && placeholder}
					onChange={(e) => {
						setInput({
							...input,
							price: e.target.value.length === 0 ? '' : Number(e.target.value),
						});
						field.onChange({
							...input,
							price: e.target.value.length === 0 ? 0 : Number(e.target.value),
						});
					}}
					disabled={disabled}
				/>
				<div className='absolute top-0 right-0 flex gap-1 items-center pr-0'>
					{fieldState.error && (
						<ExclamationCircleIcon
							className='h-5 w-5 text-red-500'
							aria-hidden='true'
						/>
					)}
					<select
						className=' rounded-md border-transparent bg-transparent py-2 pl-2 pr-7 text-gray-500 focus:border-slate-500 focus:ring-slate-500 sm:text-sm'
						onChange={(e) => {
							setInput({ ...input, codeCurrency: e.target.value });
							field.onChange({ ...input, codeCurrency: e.target.value });
						}}
						value={input.codeCurrency}
						disabled={disabled}
					>
						{currencies.map((item, idx) => (
							<option key={idx} value={item}>
								{item}
							</option>
						))}
					</select>
				</div>
				{fieldState.error && (
					<p className='mt-2 text-sm text-red-600'>
						{fieldState.error?.message}
					</p>
				)}
			</div>
		</div>
	);
};

export default CurrencyInput;
