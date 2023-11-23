import React, { useEffect, useState } from 'react'
import Breadcrumb, { PathInterface } from '../../../components/navigation/Breadcrumb';
import { CircleStackIcon, PlusIcon } from '@heroicons/react/20/solid';
import useServerCurrency from '../../../api/useServerCurrency';
import GenericTable, { DataTableInterface } from '../../../components/misc/GenericTable';
import { CurrencyInterface } from '../../../interfaces/ServerInterfaces';
import Paginate from '../../../components/misc/Paginate';
import Modal from '../../../components/modals/GenericModal';
import AddNewCurrencyModal from './AddNewCurrencyModal';
import EditCurrencyModal from './EditCurrencyModal';

const CurrencyList = () => {

    const { isLoading, getAllCurrencys, allCurrencys, paginate, registerNewCurrency, isFetching, updateCurrency } = useServerCurrency()

    const [addCurrencyModal, setAddCurrencyModal] = useState(false);

    const [filter, setFilter] = useState<
        Record<string, string | number | boolean | null>
    >({});

    const [editCurrencyModal, setEditCurrencyModal] = useState<{
        state: boolean;
        id: number | null;
    }>({ state: false, id: null });

    const paths: PathInterface[] = [
        {
            name: 'Listado',
        },
    ];

    const tableTitles = ['Nombre', 'Código'];

    const tableData: DataTableInterface[] = [];

    allCurrencys?.map((item: CurrencyInterface) => {
        tableData.push({
            rowId: item.id,
            payload: {
                Nombre: item?.name,
                "Código": item?.code,
            },
        });
    });

    const searching = {
        action: (search: string) => {
            setFilter({ ...filter, search });
        },
        placeholder: 'Buscar moneda',
    };

    const actions = [
        {
            icon: <PlusIcon className='h-5' />,
            title: 'Nueva moneda',
            action: () => {
                setAddCurrencyModal(true);
            },
        },
    ];

    const rowAction = (id: number) => {
        console.log({ id })
        console.log(tableData.find(element => element.rowId === id)?.payload)
        console.log(allCurrencys.find(elem => elem.id === id))
        setEditCurrencyModal({ state: true, id });
    };

    useEffect(() => {
        getAllCurrencys(filter);
    }, [filter]);

    const closeNewCurrency = () => {
        setAddCurrencyModal(false);
    };

    return (
        <>
            <Breadcrumb
                icon={<CircleStackIcon className='h-6 text-gray-500' />}
                paths={paths}
            />
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
                addCurrencyModal && (
                    <Modal state={addCurrencyModal} close={setAddCurrencyModal}>
                        <AddNewCurrencyModal close={closeNewCurrency} registerNewCurrency={registerNewCurrency} isFetching={isFetching} />
                    </Modal>
                )
            }
            {
                editCurrencyModal.state && (
                    <Modal state={editCurrencyModal.state} close={setEditCurrencyModal}>
                        <EditCurrencyModal id={editCurrencyModal.id!} close={closeNewCurrency} updateCurrency={updateCurrency} isFetching={isFetching} allCurrencys={allCurrencys} />
                    </Modal>
                )
            }
        </>
    )
}

export default CurrencyList
