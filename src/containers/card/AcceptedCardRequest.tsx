import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb, {
    PathInterface,
} from '../../components/navigation/Breadcrumb';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import SideNav from '../../components/navigation/SideNav';
import Card from './Accepted/Card';
import PendingPrinting from './Accepted/PendingPrinting';
import PendingDelivery from './Accepted/PendingDelivery';
import useServerCards from '../../api/userServerCards';

const AcceptedCardRequest = () => {

    const navigate = useNavigate();
    const [current, setCurrent] = useState<string>('all');
    const changeTab = (to: string) => setCurrent(to);

    const CRUD = useServerCards();

   //let CRUDType = typeof CRUD;

    useEffect(() => {
		CRUD.getAllCards({});
	}, []);

    const stockTabs = [
        {
            name: 'Todas',
            href: 'all',
            current: current === 'all',
        },
        {
            name: 'Por imprimir',
            href: 'print',
            current: current === 'print',
        },
        {
            name: 'Pendientes a entregar',
            href: 'deliver',
            current: current === 'deliver',
        },
    ];

    //Breadcrumb --------------------------------------------------------------------------

    const paths: PathInterface[] = [
        {
            name: 'Tarjetas',
            action: () => navigate('/accounts'),
        },

        {
            name: 'Aceptadas',
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
                    {current === 'all' && (
                        <Card />
                    )}
                    {current === 'print' && (
                        <PendingPrinting />
                    )}
                    {current === 'deliver' && (
                        <PendingDelivery />
                    )}
                </div>
            </div>
        </>
    );
};

export default AcceptedCardRequest;