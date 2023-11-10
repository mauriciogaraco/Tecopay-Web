export type TabsAttr = {
	icon?: React.ReactNode;
	name: string;
	href: string;
	current: boolean;
};

interface TabNavProp {
	className?: string;
	tabs: TabsAttr[];
	action: Function;
	disabled?: boolean;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function TabNav({
	tabs,
	action,
	disabled,
	className,
}: TabNavProp) {
	return (
		<div className={`mb-3 ${className ? className : ''}`}>
			<div className='sm:hidden'>
				<label htmlFor='tabs' className='sr-only'>
					Selecccione
				</label>
				{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
				<select
					id='tabs'
					name='tabs'
					className='block w-full rounded-md border-gray-400 focus:border-tecopay-700 focus:ring-tecopay-700 '
					defaultValue={tabs?.find((tab) => tab.current)?.name}
					onChange={(value) => action(value)}
				>
					{tabs.map((tab) => (
						<option key={tab.name} value={tab.href}>
							{tab.name}
						</option>
					))}
				</select>
			</div>
			<div className='hidden sm:block'>
				<div className='border-b border-tecopay-200'>
					<nav className='inline-flex gap-1 w-full'>
						{tabs.map((tab) => (
							<span key={tab.name} className='inline-flex w-full'>
								<p
									onClick={() => {
										if (!disabled) action(tab.href);
									}}
									className={classNames(
										tab.current
											? 'border-tecopay-700 text-gray-700'
											: 'border-transparent text-gray-700 hover:text-gray-700 hover:border-tecopay-400',
										'py-4 text-center border-b-2 font-medium text-sm cursor-pointer flex justify-center items-center gap-2 flex-grow',
									)}
									aria-current={tab.current ? 'page' : undefined}
								>
									{tab?.icon && tab.icon}
									{tab.name}
								</p>
							</span>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}
