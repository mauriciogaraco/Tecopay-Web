import { useState, useEffect } from 'react';
import Breadcrumb, {
    PathInterface,
} from '../../components/navigation/Breadcrumb';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import SideNav from '../../components/navigation/SideNav';
import AlreadyDeliveredCards from './CardTabs/AlreadyDeliveredCards';
import PendingDeliveryCards from './CardTabs/PendingDeliveryCards';
import useServerCards from '../../api/userServerCards';

const Cards = () => {

    const [current, setCurrent] = useState<string>('not-delivered');
    const changeTab = (to: string) => setCurrent(to);

    const CRUD = useServerCards();

   //let CRUDType = typeof CRUD;

    useEffect(() => {
		CRUD.getAllCards({});
	}, []);

    const stockTabs = [
        {
            name: 'Por entregar',
            href: 'not-delivered',
            current: current === 'not-delivered',
        },
        {
            name: 'Entregadas',
            href: 'delivered',
            current: current === 'delivered',
        },
        
    ];

    //Breadcrumb --------------------------------------------------------------------------

    const paths: PathInterface[] = [
        {
            name: 'Tarjetas',
        },
    ];
    //--------------------------------------------------------------------------------------

    return (
        <>
            <div className=' flex'>
                <Breadcrumb
                    icon={<UserCircleIcon className='h-7 text-gray-500' />}
                    paths={paths}
                />
            </div>
            <div className='sm:grid grid-cols-10 gap-3'>
                <SideNav
                    tabs={stockTabs}
                    action={changeTab}
                    className='col-span-10 sm:col-span-2'
                />

                <div className='sm:col-span-8 pl-3 pt-1'>
                    {current === 'delivered' && (
                        <AlreadyDeliveredCards />
                    )}
                    {current === 'not-delivered' && (
                        <PendingDeliveryCards />
                    )}
                </div>
            </div>
        </>
    );
};

export default Cards;