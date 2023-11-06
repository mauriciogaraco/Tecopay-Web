import { useState, useEffect, useRef } from 'react';
import {
	CheckIcon,
	ChevronUpDownIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { useController, type UseControllerProps } from 'react-hook-form';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { type SelectInterface } from '../../interfaces/LocalInterfaces';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LoadingSpin from '../misc/LoadingSpin';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

interface InputProps {
	label: string;
	disabled?: boolean;
	data: SelectInterface[];
	loading?: boolean;
	changeState?: Function;
	changeDisplay?: Function;
	displayValue?: string;
	Conectividad?: boolean;
	contacto?: boolean;
}

export default function ComboBox(props: UseControllerProps & InputProps) {
	const { field, fieldState } = useController(props);
	const {
		label,
		data,
		disabled,
		defaultValue,
		loading,
		changeDisplay,
		displayValue,
		Conectividad,
		contacto,
	} = props;

	const [query, setQuery] = useState<string>('');
	const [selectedPerson, setSelectedPerson] = useState<SelectInterface | null>(
		data.find((item) => item.id === defaultValue) ?? null,
	);

	useEffect(() => {
		if (defaultValue) {
			field.onChange(defaultValue);
		}
	}, []);

	const comboBtn = useRef(null);
	// @ts-expect-error
	const handleInputFocus = () => comboBtn.current?.click();

	useEffect(() => {
		if (displayValue) handleInputFocus();
	}, [displayValue]);

	const filteredOptions =
		query === ''
			? data
			: data.filter((option) => {
					return option.name.toLowerCase().includes(query.toLowerCase());
			  });
	const dispatch = useAppDispatch();
	return (
		<>
			<Combobox
				as='div'
				className=''
				value={selectedPerson}
				onChange={(e: SelectInterface) => {
					setSelectedPerson(e);
					field.onChange(e.id);
					props.changeState?.(e);
				}}
				disabled={disabled}
				by={(current, rest) => current?.id === rest?.id}
			>
				<Combobox.Label
					className={`block text-sm font-medium ${
						disabled ? 'text-gray-400' : 'text-gray-700'
					} first-letter:uppercase`}
				>
					<span className='inline-flex items-center'>
						{label}
						{disabled && <LockClosedIcon className='px-2 h-4 z-100' />}
					</span>
				</Combobox.Label>
				{loading ? (
					<div className='border border-gray-500 flex justify-center rounded-md py-2 m-1'>
						<LoadingSpin color='gray-500' />
					</div>
				) : (
					<div className='relative mt-1'>
						<Combobox.Input
							className={`${
								fieldState.error
									? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
									: `focus:ring-gray-500 ${
											disabled ? 'border-gray-300' : 'border-gray-400'
									  } focus:border-gray-500 text-gray-500`
							} border relative w-full rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm`}
							onChange={(event) => {
								setQuery(event.target.value);
								event.isTrusted && props.changeDisplay?.(event.target.value);
							}}
							displayValue={(option: SelectInterface) => {
								return option?.name || displayValue || '';
							}}
							placeholder='Busque o seleccione'
						/>
						<div className='absolute p-2 gap-1 right-0 top-0 flex items-center rounded-r-md px-2 focus:outline-none'>
							{fieldState.error && (
								<ExclamationCircleIcon
									className='h-5 w-5 text-red-500'
									aria-hidden='true'
								/>
							)}
							<Combobox.Button ref={comboBtn}>
								<ChevronUpDownIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</Combobox.Button>
						</div>

						{filteredOptions.length > 0 && (
							<Combobox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								{filteredOptions.map((option) => (
									<Combobox.Option
										key={option.id}
										value={option}
										className={({ active }) =>
											classNames(
												'relative cursor-default select-none py-2 pl-3 pr-9',
												active ? 'bg-slate-600 text-white' : 'text-gray-900',
											)
										}
									>
										{({ active, selected }) => (
											<>
												<span
													className={classNames(
														'block truncate',
														`${selected ? 'font-semibold' : ''}`,
													)}
												>
													{option.name}
												</span>

												{selected && (
													<span
														className={classNames(
															'absolute inset-y-0 right-0 flex items-center pr-4',
															active ? 'text-white' : 'text-indigo-600',
														)}
													>
														<CheckIcon className='h-5 w-5' aria-hidden='true' />
													</span>
												)}
											</>
										)}
									</Combobox.Option>
								))}
							</Combobox.Options>
						)}
						{fieldState.error && (
							<span className='text-xs text-red-600'>
								{fieldState.error.message}
							</span>
						)}
					</div>
				)}
			</Combobox>
		</>
	);
}
