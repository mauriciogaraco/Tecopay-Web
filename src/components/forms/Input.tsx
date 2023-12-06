import { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { useController, UseControllerProps } from 'react-hook-form';

interface InputProps {
	label?: string;
	placeholder?: string;
	type?: 'number' | 'text' | 'password';
	disabled?: boolean;
	stackedText?: string;
	textAsNumber?: boolean;
	numberAsCurrency?: { precision: number };
	inputClass?: string;
	changeState?: any;
}

const showAsCurrency = (amount: number, precision: number) =>
	new Intl.NumberFormat('en-EN', {
		style: 'currency',
		currency: 'USD',
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: precision,
	}).format(amount);

const Input = (props: UseControllerProps & InputProps) => {
	const {
		label,
		placeholder,
		defaultValue,
		type = 'text',
		disabled,
		stackedText,
		numberAsCurrency,
		textAsNumber,
		changeState,
	} = props;
	const { field, fieldState } = useController(props);
	const { inputClass } = props;

	const initialValue =
		type === 'number' && numberAsCurrency
			? showAsCurrency(
					field.value ?? defaultValue ?? 0,
					numberAsCurrency.precision,
			  )
			: field.value ?? defaultValue;

	const [input, setInput] = useState<string>(initialValue ?? '');

	if (changeState) changeState.current = setInput;

	useEffect(() => {
		if (type === 'number') field.onChange(defaultValue ?? 0);
	}, []);

	return (
		<div className='w-full'>
			{label && (
				<label
					htmlFor={label}
					className='block text-sm font-medium text-gray-700'
				>
					{label}
				</label>
			)}
			<div className='relative mt-1 rounded-md shadow-sm inline-flex items-center w-full'>
				{stackedText && (
					<span
						className={`${
							fieldState.error
								? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
								: 'focus:ring-gray-400 border-gray-400 focus:border-gray-600 text-gray-500'
						} rounded-md sm:text-sm p-2 border border-r-0 rounded-r-none w-full text-right`}
					>
						{stackedText && stackedText}
					</span>
				)}
				<input
					type={type === 'password' ? type : 'text'}
					className={
						inputClass
							? inputClass
							: `${
									fieldState.error
										? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
										: 'focus:ring-gray-400 border-gray-400 focus:border-gray-600 text-gray-500'
							  } block w-full rounded-md sm:text-sm placeholder:text-slate-400 ${
									stackedText ? 'rounded-l-none' : ''
							  }`
					}
					placeholder={placeholder && placeholder}
					value={input}
					onChange={(e) => {
						if (textAsNumber && type === 'text') {
							if (
								(e.target.value.charCodeAt(e.target.value.length - 1) >= 48 &&
									e.target.value.charCodeAt(e.target.value.length - 1) <= 57) ||
								e.target.value.charCodeAt(e.target.value.length - 1) === 43 ||
								e.target.value === ''
							) {
								setInput(e.target.value);
								field.onChange(e.target.value);
							}
						} else if (numberAsCurrency && type === 'number') {
							if (
								(e.target.value.charCodeAt(e.target.value.length - 1) >= 48 &&
									e.target.value.charCodeAt(e.target.value.length - 1) <= 57) ||
								[36, 44, 46].includes(
									e.target.value.charCodeAt(e.target.value.length - 1),
								) ||
								e.target.value === ''
							) {
								setInput('$' + e.target.value.replace(/[$,]/g, ''));
								field.onChange(Number(e.target.value.replace(/[$,]/g, '')));
							}
						} else if (type === 'number') {
							if (
								(e.target.value.charCodeAt(e.target.value.length - 1) >= 48 &&
									e.target.value.charCodeAt(e.target.value.length - 1) <= 57) ||
								(e.target.value.charCodeAt(e.target.value.length - 1) === 46 &&
									!e.target.value
										.slice(0, e.target.value.length - 1)
										.includes('.')) ||
								e.target.value === ''
							) {
								setInput(e.target.value);
								field.onChange(Number(e.target.value));
							}
						} else {
							setInput(e.target.value);
							field.onChange(e.target.value);
						}
					}}
					disabled={disabled}
				/>

				{fieldState.error && (
					<>
						<div className='pointer-events-none absolute inset-y-0 right-0 top-2 pr-3'>
							<ExclamationCircleIcon
								className='h-5 w-5 text-red-500'
								aria-hidden='true'
							/>
						</div>

						<p className='absolute -bottom-5 text-xs text-red-600 flex flex-shrink-0'>
							{fieldState.error?.message}
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default Input;
