import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import ImageComponent from '../misc/Images/Image';

interface BranchList {
	closeModal: Function;
	branches: any;
}

export default function BranchesList({ closeModal, branches }: BranchList) {
	const index = branches.findIndex((item: any) => item.isMain);
	const redirect = useNavigate();

	const changeBranch = (id: number | null) => {
		redirect('/');
		closeModal();
	};
	return (
		<div className='h-96'>
			<div className='border-b-2 border-gray-200 bg-white pb-4 cursor-pointer'>
				<div className='-ml-4 -mt-4 flex items-center'>
					<div className='flex flex-grow ml-4 mt-4 justify-between items-center'>
						<div
							className='flex items-center'
							onClick={() => changeBranch(branches[index]?.id ?? null)}
						>
							<div className='flex-shrink-0'>
								<ImageComponent
									className='h-12 w-12 rounded-full overflow-hidden'
									src={branches[index].logo?.src}
									hash={branches[index].logo?.blurHash}
								/>
							</div>
							<div className='ml-4'>
								<h3 className='text-base font-semibold leading-6 text-gray-900'>
									{branches[index]?.name}
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='mt-2 flow-root overflow-auto h-64 scrollbar-thin'>
				<ul role='list' className='-my-5 divide-y divide-gray-200 py-2 '>
					{branches
						.filter((item: any) => !item.isMain)
						.map((branch: any) => (
							<li key={branch.id} className='py-4 cursor-pointer'>
								<div
									className='flex items-center space-x-4'
									onClick={() => changeBranch(branch.id ?? null)}
								>
									<div className='flex-shrink-0'>
										<ImageComponent
											className='h-8 w-8 rounded-full overflow-hidden'
											src={branch.logo?.src}
											hash={branch.logo?.blurHash}
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-medium text-gray-900'>
											{branch.name}
										</p>
									</div>
									<div className='inline-flex items-center gap-2'>
										<ChevronRightIcon className='h-4' />
									</div>
								</div>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}
