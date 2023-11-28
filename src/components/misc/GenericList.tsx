export interface ListHeader {
	title: string | React.ReactNode;
	subtitle?: string | React.ReactNode;
	alert?: boolean;
}

export interface ActionBtnInterface {
	icon: React.ReactNode;
	btnColor?: string;
	action: Function;
}

interface GenericList {
	header?: ListHeader;
	body: Record<string, string | number | React.ReactNode>;
	actionBtn?: ActionBtnInterface | ActionBtnInterface[];
}

export default function GenericList({ header, body, actionBtn }: GenericList) {
	return (
		//header
		<div className=' overflow-hidden bg-white shadow sm:rounded-lg'>
			<div
				className={`flex justify-between ${
					header?.alert ? 'bg-red-50' : 'bg-gray-50'
				} items-center pr-5`}
			>
				{header && (
					<div className='px-4 py-5 sm:px-6 '>
						{typeof header.title === 'string' ? (
							<h3 className='text-lg font-medium leading-6 text-gray-900'>
								{header.title}
							</h3>
						) : (
							header.title
						)}

						{typeof header.subtitle === 'string' ? (
							<p className='mt-1 max-w-2xl text-sm text-gray-500'>
								{header.subtitle}
							</p>
						) : (
							<div className='mt-1 max-w-2xl text-sm text-gray-500'>
								{header.subtitle}
							</div>
						)}
					</div>
				)}
				{actionBtn &&
					(actionBtn && Array.isArray(actionBtn) ? (
						<div className={`grid grid-cols-${actionBtn.length} gap-5`}>
							{actionBtn.map((item, key) => (
								<button
									key={key}
									className={`inline-flex items-center rounded border border-inherit bg-${item.btnColor} px-2.5 py-1.5 text-xs font-medium text-${item.btnColor}-100 shadow-sm hover:bg-${item.btnColor}-700 focus:outline-none focus:ring-2 focus:ring-${item.btnColor}-500 focus:ring-offset-2`}
									onClick={() => item.action()}
								>
									{item.icon}
								</button>
							))}
						</div>
					) : (
						<button
							className={`inline-flex items-center rounded border border-transparent bg-${actionBtn.btnColor}-500 px-2.5 py-1.5 text-xs font-medium text-${actionBtn.btnColor}-100 shadow-sm hover:bg-${actionBtn.btnColor}-700 focus:outline-none focus:ring-2 focus:ring-${actionBtn.btnColor}-500 focus:ring-offset-2`}
							onClick={() => actionBtn.action()}
						>
							{actionBtn.icon}
						</button>
					))}
			</div>

			<div className='border-t border-gray-200'>
				<dl>
					{Object.entries(body).map((item, idx) => (
						<div key={idx}>
							{typeof item[1] === 'string' ||
							typeof item[1] === 'number' ||
							typeof item[1] === null ||
							typeof item[1] === 'object' ? (
								<div
									key={idx}
									className={`${
										idx % 2 !== 0 && 'bg-gray-100'
									} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 scrollbar-thin`}
								>
									<dt className='text-sm font-medium text-gray-500'>
										{item[0]}
									</dt>
									<dd
										className={`mt-1 text-sm ${
											item.length > 1 && 'flex gap-5'
										} text-gray-900 sm:col-span-2 sm:mt-0`}
									>
										{item[1]}
									</dd>
								</div>
							) : (
								<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 text '>
										{item[0]}
									</dt>
									<dd className='mt-1 text-sm text-gray-900'>{item[1]}</dd>
								</div>
							)}
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
