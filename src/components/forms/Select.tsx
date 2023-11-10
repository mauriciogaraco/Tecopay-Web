import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useController, UseControllerProps } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { SelectInterface } from '../../interfaces/LocalInterfaces';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

interface InputProps {
	label: string;
	default?: string | number;
	disabled?: boolean;
	data: Array<SelectInterface>;
}

export default function Select(props: UseControllerProps & InputProps) {
	const { field, fieldState } = useController(props);
	const { label, data, disabled, defaultValue } = props;
	const [selected, setSelected] = useState<SelectInterface | null>(null);

	useEffect(() => {
		const current = data.findIndex(
			(item) => item.name === defaultValue || field.value === item.name,
		);
		if (current !== -1) {
			setSelected(data[current]);
			field.onChange(data[current].name);
		}
	}, []);

	return (
		<div className=''>
			<Listbox
				value={selected}
				onChange={(e) => {
					setSelected(e);
					field.onChange(e.name);
				}}
				disabled={disabled}
				defaultValue={field.value}
			>
				{({ open }) => (
					<>
						<Listbox.Label
							className={`block text-sm font-medium ${
								disabled ? 'text-gray-400' : 'text-gray-700'
							} first-letter:uppercase`}
						>
							<span className='inline-flex items-center'>
								{label}
								{disabled && <LockClosedIcon className='px-2 h-4' />}
							</span>
						</Listbox.Label>
						<div className='relative mt-1'>
							<Listbox.Button
								className={`${
									fieldState.error
										? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
										: `focus:ring-gray-500 ${
												disabled ? 'border-gray-300' : 'border-gray-500'
										  } focus:border-gray-600 text-gray-500`
								} border relative w-full cursor-pointer rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm`}
								{...field}
							>
								<span className='block truncate'>
									{selected?.name
										? selected?.name
										: data.length !== 0
										? 'Seleccione'
										: 'No hay opciones que mostrar'}
								</span>
								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
									<ChevronUpDownIcon
										className='h-5 w-5 text-gray-400'
										aria-hidden='true'
									/>
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave='transition ease-in duration-100'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<Listbox.Options className='absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-400'>
									{data.map((item) => (
										<Listbox.Option
											key={item.id}
											className={({ active }) =>
												classNames(
													active ? 'text-white bg-indigo-600' : 'text-gray-900',
													'relative cursor-default select-none py-2 pl-3 pr-9',
												)
											}
											disabled={item.disabled}
											value={item}
										>
											{({ selected, active, disabled }) => (
												<>
													<span
														className={classNames(
															selected
																? 'font-semibold'
																: `${
																		disabled ? 'text-gray-300' : 'font-normal'
																  }`,
															'block truncate',
														)}
													>
														{item.name}
													</span>

													{selected && (
														<span
															className={classNames(
																active ? 'text-white' : 'text-indigo-600',
																'absolute inset-y-0 right-0 flex items-center pr-4',
															)}
														>
															<CheckIcon
																className='h-5 w-5'
																aria-hidden='true'
															/>
														</span>
													)}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
							{fieldState.error && (
								<>
									<div className='pointer-events-none absolute inset-y-0 right-5 -top-6 flex items-center pr-3'>
										<ExclamationCircleIcon
											className='h-5 w-5 text-red-500'
											aria-hidden='true'
										/>
									</div>
									<span className='text-xs text-red-600'>
										{fieldState.error.message}
									</span>
								</>
							)}
						</div>
					</>
				)}
			</Listbox>
		</div>
	);
}
