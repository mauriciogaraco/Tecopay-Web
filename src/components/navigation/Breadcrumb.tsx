export interface PathInterface {
	name: string;
	action?: Function;
}

interface BreadCrumbProp {
	paths: PathInterface[];
	icon: React.ReactNode;
}

export default function Breadcrumb({ paths, icon }: BreadCrumbProp) {
	return (
		<nav
			className='flex border-b border-gray-300 mb-3 shadow-sm w-full'
			aria-label='Breadcrumb'
		>
			<ol
				role='list'
				className='flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6'
			>
				<li className='flex'>
					<div className='flex items-center'>
						<div className='text-gray-400 hover:text-gray-500'>
							{icon}
							<span className='sr-only'>Home</span>
						</div>
					</div>
				</li>
				{paths.map((current) => (
					<li key={current.name} className='flex'>
						<div
							className={`flex items-center ${
								current.action && 'cursor-pointer'
							}`}
							onClick={() => (current.action ? current.action() : null)}
						>
							<svg
								className='h-full w-6 flex-shrink-0 text-gray-300 shadow-sm'
								viewBox='0 0 24 44'
								preserveAspectRatio='none'
								fill='currentColor'
								aria-hidden='true'
							>
								<path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
							</svg>
							<p className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
								{current.name}
							</p>
						</div>
					</li>
				))}
			</ol>
		</nav>
	);

	/*return (
    <nav className="inline-flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            {icon}
            <span className="sr-only">Icon</span>
          </div>
        </li>
        {paths.map((current, index) => (
          <li key={index}>
            <div
              className={`flex items-center ${
                current.action && "cursor-pointer"
              }`}
              onClick={() => (current.action ? current.action() : null)}
            >
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <h4 className="ml-4 font-medium text-gray-500 hover:text-gray-700 text-lg first-letter:uppercase">
                {current.name}
              </h4>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );*/
}
