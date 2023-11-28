import React, { useState } from 'react';
import Breadcrumb, {
	PathInterface,
} from '../../../components/navigation/Breadcrumb';
import { CircleStackIcon } from '@heroicons/react/20/solid';
import TabNav from '../../../components/navigation/TabNav';
import Registry from './registry/Registry';
import Rate from './rate/Rate';

const CurrencyExchangeRate = () => {
	const paths: PathInterface[] = [
		{
			name: 'Tasa de cambio',
		},
	];

	const [cashTab, setCashTab] = useState('rate');

	const tabs = [
		{
			name: 'Tasas',
			href: 'rate',
			current: cashTab === 'rate',
		},
		{
			name: 'Registros',
			href: 'registry',
			current: cashTab === 'registry',
		},
	];

	return (
		<div>
			<Breadcrumb
				icon={<CircleStackIcon className='h-6 text-gray-500' />}
				paths={paths}
			/>

			<TabNav tabs={tabs} action={(value: string) => setCashTab(value)} />
			{cashTab === 'rate' && <Rate />}
			{cashTab === 'registry' && <Registry />}
		</div>
	);
};

export default CurrencyExchangeRate;
