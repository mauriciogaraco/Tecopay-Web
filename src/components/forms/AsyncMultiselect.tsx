import {
	Fragment,
	useState,
	useEffect,
	BaseSyntheticEvent,
	useRef,
	useMemo,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useController, UseControllerProps } from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { BasicType, SelectInterface } from '../../interfaces/InterfacesLocal';
import LoadingSpin from '../misc/LoadingSpin';
import apiQuery from '../../api/APIServices';
import { generateUrlParams } from '../../utils/helpers';
import useServer from '../../api/useServer';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

interface InputProps {
	changeState?: Function;
	loading?: boolean;
	byDefault?: (string | number | null)[];
	label?: string;
	className?: string;
	disabled?: boolean;
	dataQuery: {
		url: string;
		defaultParams?: BasicType;
	};
	nullOpt?: { id: string | number | null; name: string };
	normalizeData: {
		id: string;
		name: string | string[];
		disabled?: (string | number)[];
	};
	defaultItem?: { id: string | number | null; name: string };
	dependendValue?: BasicType;
	callback?: Function;
	setSelectedDataToParent?: Function;
	selectedDataToParent?: any;
	setSelectedDataToParentTwo?: Function;
}

export default function AsyncMultiSelect(
	props: UseControllerProps & InputProps,
) {
	const { manageErrors } = useServer();
	const {
		className,
		defaultItem,
		dataQuery,
		normalizeData,
		dependendValue,
		callback,
		nullOpt,
		setSelectedDataToParent,
		selectedDataToParent,
		setSelectedDataToParentTwo,
	} = props;
	const { field, fieldState } = useController(props);
	const { label, disabled, byDefault } = props;
	const [selected, setSelected] = useState<SelectInterface[]>([]);

	//query management states ----------------------------------------------------------
	const [query, setQuery] = useState<string | null>(null);
	const [data, setData] = useState<SelectInterface[]>([]);
	const [selectedData, setSelectedData] = useState<SelectInterface | null>(
		null,
	);
	const newArray = [{}];
	const [loading, setLoading] = useState(false);

	const currentDependendValue = useRef<
		string | number | boolean | null | undefined
	>();

	const allParams: BasicType | undefined = useMemo(() => {
		let params: BasicType = {};
		if (dataQuery.defaultParams) {
			params = { ...dataQuery.defaultParams };
		}
		if (dependendValue) {
			const [key, value] = Object.entries(dependendValue)[0];
			if (value !== currentDependendValue.current) {
				currentDependendValue.current = value;
				params[key] = currentDependendValue.current;
			}
		}
		if (query) {
			params.search = query;
		}

		return params;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dependendValue, query]);

	//API query --------------------------------------------------------------------------
	const apiCall = async () => {
		setLoading(true);
		await apiQuery
			.get(`${dataQuery.url}${generateUrlParams()}`)
			.then((resp) => {
				const items: SelectInterface[] = resp.data.items.map(
					(elem: Record<string, string | number | boolean | null>) => {
						if (typeof normalizeData.name === 'string') {
							return {
								id: elem[normalizeData.id],
								name: elem[normalizeData.name],
							};
						} else {
							const key = normalizeData.name.find((key) => !!elem[key]);
							return {
								id: elem[normalizeData.id],
								name: key ? elem[key] : '-',
							};
						}
					},
				);
				console.log(resp.data.items);
				console.log(items);
				setData(nullOpt ? [nullOpt, ...items] : items);
				callback && callback(resp.data.items);
			})
			.catch((e) => manageErrors(e));
		setLoading(false);
	};

	useEffect(() => {
		const elemDefault = data.find((item) => item.id === defaultItem?.id);
		if (elemDefault && !selectedData) {
			setSelectedData(elemDefault);
		} else if (defaultItem && !selectedData) {
			setSelectedData(defaultItem);
			//if (setSelectedDataToParent) setSelectedDataToParent(defaultItem);
			//if (setSelectedDataToParentTwo) setSelectedDataToParentTwo(defaultItem);
		}
		apiCall();
	}, []);

	//Debounce for filter -----------------------------------------------------------------------------
	const [timeOutId, setTimeOutId] = useState<number | undefined>();
	const onKeyDown = () => {
		clearTimeout(timeOutId);
	};

	const onKeyUp = (e: BaseSyntheticEvent) => {
		const time = Number(
			setTimeout(() => {
				if (e.target.value !== '') {
					setQuery(e.target.value);
				} else {
					setQuery(null);
				}
			}, 800),
		);
		setTimeOutId(Number(time));
	};
	//--------------------------------------------------------------------------------

	return (
		<div>
			<Listbox
				value={selected}
				onChange={(e) => {
					setSelected(e);
					field.onChange(e.map((item) => item.id));

					props.changeState && props.changeState(e);
				}}
				disabled={disabled}
				by='id'
				multiple
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
						{loading ? (
							<div className='border border-gray-500 flex justify-center rounded-md py-2 m-1'>
								<LoadingSpin color='gray-500' />
							</div>
						) : (
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
									{data.length === 0
										? 'No hay opciones que mostrar'
										: selected.length === 0
										? 'Seleccione'
										: selected.map((item) => (
												<span
													key={item.id}
													className='inline-flex border border-gray rounded p-1 m-1'
													onClick={() => {
														const filtered = selected.filter(
															(values) => item.id !== values.id,
														);
														setSelected(filtered);
														field.onChange(filtered.map((item) => item.id));
													}}
												>
													{item.name}
												</span>
										  ))}

									<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
										<ChevronUpDownIcon
											className='h-5 w-5 text-gray-400'
											aria-hidden='true'
										/>
									</span>
								</Listbox.Button>

								{data.length !== 0 && (
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
															active
																? 'text-white bg-indigo-600'
																: 'text-gray-900',
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
																				disabled
																					? 'text-gray-300'
																					: 'font-normal'
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
								)}
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
						)}
					</>
				)}
			</Listbox>
		</div>
	);
}
