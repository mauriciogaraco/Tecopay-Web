export default function NotFoundPage() {
	return (
		<>
			<div className='flex h-screen flex-col bg-white pt-16 pb-12'>
				<main className='mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-shrink-0 justify-center'>
						<a href='/' className='inline-flex'>
							<span className='sr-only'>Your Company</span>
							<img className='h-20 w-auto' src='/logo512.png' alt='' />
						</a>
					</div>
					<div className='py-10'>
						<div className='text-center'>
							<p className='text-4xl font-semibold text-tecopay-600'>404</p>
							<h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
								Página no encontrada
							</h1>
							<p className='mt-2 text-base text-gray-500'>
								Lo sentimos, la página que solicita no pudo ser encontrada.
							</p>
							<div className='mt-6'>
								<a
									href='/'
									className='text-base font-medium text-tecopay-600 hover:text-orange-500'
								>
									Volver al Inicio
									<span aria-hidden='true'> &rarr;</span>
								</a>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
