import React from 'react'
import Breadcrumb, { PathInterface } from '../../../components/navigation/Breadcrumb'
import { CircleStackIcon } from '@heroicons/react/20/solid'

const CurrencyExchangeRate = () => {

    const paths: PathInterface[] = [
		{
			name: 'Tasa de cambio',
		},
	];

    return (
        <div>
            <Breadcrumb
                icon={<CircleStackIcon className='h-6 text-gray-500' />}
                paths={paths}
            />

        </div>
    )
}

export default CurrencyExchangeRate
