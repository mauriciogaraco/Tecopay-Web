

import { useState, useEffect } from 'react'
import GenericTable, { DataTableInterface } from '../../../../components/misc/GenericTable';
import { PlusIcon } from '@heroicons/react/20/solid';
import useServerCurrency from '../../../../api/useServerCurrency';
import Paginate from '../../../../components/misc/Paginate';
import Modal from '../../../../components/modals/GenericModal';
import { ExchangeRateInterface } from '../../../../interfaces/ServerInterfaces';
import AddNewExchangeRateModal from './AddNewExchangeRateModal';
import EditExchangeRateModal from './EditExchangeRateModal';

const Rate = () => {
    const { isLoading, allExchangeRates, getAllExchangeRate, paginate, registerNewExchangeRate, isFetching, updateExchangeRate, deleteExchangeRate } = useServerCurrency()

    const [addRateModal, setAddRateModal] = useState(false);

    const [filter, setFilter] = useState<
        Record<string, string | number | boolean | null>
    >({});

    const [editRateModal, setEditRateModal] = useState<{
        state: boolean;
        id: number | null;
    }>({ state: false, id: null });


    const tableTitles = ['Moneda base', 'Moneda dependiente', 'Precio de compra', 'Precio de venta'];

    const tableData: DataTableInterface[] = [];

    allExchangeRates?.map((item: ExchangeRateInterface) => {
        tableData.push({
            rowId: item.id,
            payload: {
                'Moneda base': item?.baseCurrency.name,
                'Moneda dependiente': item?.dependentCurrency.name,
                'Precio de compra': item.buyRate,
                'Precio de venta': item.sellRate,
            },
        });
    });

    const searching = {
        action: (search: string) => {
            setFilter({ ...filter, search });
        },
        placeholder: 'Buscar por moneda base',
    };

    const actions = [
        {
            icon: <PlusIcon className='h-5' />,
            title: 'Nueva tasa',
            action: () => {
                setAddRateModal(true);
            },
        },
    ];

    const rowAction = (id: number) => {
        setEditRateModal({ state: true, id });
    };

    useEffect(() => {
        getAllExchangeRate(filter);
    }, [filter]);

    const closeNewExchangeRate = () => {
        setAddRateModal(false);
    };

    return (
        <>
            <GenericTable
                tableData={tableData}
                tableTitles={tableTitles}
                loading={isLoading}
                searching={searching}
                actions={actions}
                rowAction={rowAction}
                paginateComponent={
                    <Paginate
                        action={(page: number) => {
                            setFilter({ ...filter, page });
                        }}
                        data={paginate}
                    />
                }
            />

            {
                addRateModal && (
                    <Modal state={addRateModal} close={setAddRateModal}>
                        <AddNewExchangeRateModal close={closeNewExchangeRate} registerNewExchangeRate={registerNewExchangeRate} isFetching={isFetching} />
                    </Modal>
                )
            }
            {
                editRateModal.state && (
                    <Modal state={editRateModal.state} close={setEditRateModal}>
                        <EditExchangeRateModal id={editRateModal.id!} close={closeNewExchangeRate} updateExchangeRate={updateExchangeRate} isFetching={isFetching} allExchangeRates={allExchangeRates} deleteExchangeRate={deleteExchangeRate}/>
                    </Modal>
                )
            }
        </>
    )
}

export default Rate
