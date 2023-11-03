import { PlusIcon, TicketIcon, UsersIcon, UserCircleIcon } from "@heroicons/react/24/outline";
//import useServerClients from "../../api/useServerClients";
import GenericTable, {
  DataTableInterface,
  FilterOpts,
} from "../components/misc/GenericTable";
import useServerUser from "../api/userServerUser";

import Paginate from "../components/misc/Paginate";
import Modal from "../components/modals/GenericModal";
import Breadcrumb, { PathInterface } from "../components/navigation/Breadcrumb";
//import AddClientWizzard from "./addClient/AddClientWizzard";
import { useNavigate } from "react-router-dom";
//import { BsFiletypeXlsx } from "react-icons/bs";
//import { SubmitHandler, useForm } from "react-hook-form";
//import Input from "../../components/forms/Input";
//import Button from "../../components/misc/Button";
import { BasicType, SelectInterface } from "../interfaces/InterfacesLocal";
//import useServerOnlineClients from "../../api/useServerOnlineClients";
//import { formatCalendar } from "../../utils/helpers";
//import { translateRegWay } from "../../utils/translate";
import { useEffect, useState } from "react";
import NuevoTicketModal from "../components/modals/NuevoTicketModal";
import { data } from "../utils/TemporaryArrayData";
import axios from "axios";
import EditUserContainer from "../containers/tickets/editTicketWizzard/EditUserContainer";

const Tickets = () => {
  const [query, setQuery] = useState<string>("");
  const [queryText, setQueryText] = useState("");
  const [post, setPost] = useState(null)


  const {
    allUsers,
    allTickets,
    setAllTickets,
    paginate,
    getAllUsers,
    editUser,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    isLoading,
    isFetching,
    setRender,
  } = useServerUser();

  const handleSearch = (e: any) => {
    e.preventDefault();
    setQuery(queryText);
  };

  const filteredOptions =
    query === ""
      ? data
      : data.filter(
        ({
          cliente,
          no,
          fecha,
          description,
          prioridad,
          clasificacion,
          email,
        }) => {
          return (
            cliente.toLowerCase().includes(query.toLowerCase()) ||
            no.toLowerCase().includes(query.toLowerCase()) ||
            prioridad.toLowerCase().includes(query.toLowerCase()) ||
            clasificacion.toLowerCase().includes(query.toLowerCase()) ||
            email.toLowerCase().includes(query.toLowerCase()) ||
            fecha.toLowerCase().includes(query.toLowerCase()) ||
            cliente.toLowerCase().includes(query.toLowerCase())
          );
        }
      );

  /*const {
              getAllClients,
              addClient,
              allClients,
              paginate,
              isLoading,
              isFetching,
            } = useServerOnlineClients();*/

  const [filter, setFilter] = useState<
    Record<string, string | number | boolean | null>
  >({});
  const [addTicketmodal, setAddTicketmodal] = useState(false);
  //const [exportModal, setExportModal] = useState(false);

  /*useEffect(() => {
              getAllClients(filter);
            }, [filter]);*/

  //Data for table ------------------------------------------------------------------------
  const tableTitles = [
    "Codigo",
    "Nombre",
    "Entidad",
    "Propietario",
    "Moneda",
    "Direccion",
    "Descripcion",
  ];
  const tableData: DataTableInterface[] = [];
  // eslint-disable-next-line array-callback-return 

  // @ts-ignore
  allTickets?.map((item: any) => {
    tableData.push({
      rowId: item.id,
      payload: {
        "No.": item.id,
        Codigo: `${item?.code}`,
        Nombre: item?.name,
        Entidad: item?.issueEntityId,
        Propietario: item.ownerId,
        Moneda: item.currencyId,
        Descripcion: item.description,
        Direccion: item.address
      },
    });
  });

  const searching = {
    action: (search: string) => setFilter({ ...filter, search }),
    placeholder: "Buscar ticket",
  };
  const close = () => setEditTicketModal({ state: false, id: null })
  const actions = [
    {
      icon: <PlusIcon className="h-5" />,
      title: "Agregar cuenta",
      action: () => setAddTicketmodal(true),
    },
    /*{
                title: "Exportar a excel",
                action: () => setExportModal(true),
                icon: <BsFiletypeXlsx />,
              },*/
  ];

  const rowAction = (id: number) => {
    setEditTicketModal({ state: true, id });
  };

  //Filters-----------------------------------
  const registrationSelector: SelectInterface[] = [
    {
      id: "WOO",
      name: "WOO",
    },
    {
      id: "ONLINE",
      name: "ONLINE",
    },
    {
      id: "POS",
      name: "POS",
    },
  ];

  const sexSelector: SelectInterface[] = [
    {
      id: "female",
      name: "Femenino",
    },
    {
      id: "male",
      name: "Masculino",
    },
  ];

  const availableFilters: FilterOpts[] = [
    //País
    {
      format: "select",
      filterCode: "countryId",
      name: "País",
      asyncData: {
        url: "/public/countries",
        idCode: "id",
        dataCode: "name",
      },
    },
    //Provincia
    {
      format: "select",
      filterCode: "provinceId",
      name: "Provincia",
      dependentOn: "countryId",
      asyncData: {
        url: "/public/provinces",
        idCode: "id",
        dataCode: "name",
      },
    },
    //Municipio
    {
      format: "select",
      filterCode: "municipalityId",
      name: "Municipio",
      dependentOn: "provinceId",
      asyncData: {
        url: "/public/municipalities",
        idCode: "id",
        dataCode: "name",
      },
    },
    //Forma de registro
    {
      format: "select",
      filterCode: "registrationWay",
      name: "Forma de registro",
      data: registrationSelector,
    },
    //Nacimiento desde
    {
      format: "datepicker",
      filterCode: "birthFrom",
      name: "Fecha de nacimiento desde",
    },
    //Nacimiento hasta
    {
      format: "datepicker",
      filterCode: "birthTo",
      name: "Fecha de nacimiento hasta",
    },
    //Forma de registro
    {
      format: "select",
      filterCode: "sex",
      name: "Sexo",
      data: sexSelector,
    },
  ];

  //const filterAction = (data: BasicType) => setFilter(data);
  //----------------------------------------------------------------------------------

  //Breadcrumb-----------------------------------------------------------------------------------
  const paths: PathInterface[] = [
    {
      name: "Cuentas",
    },
  ];
  //------------------------------------------------------------------------------------
  const [nuevoTicketModal, setNuevoTicketModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [editTicketModal, setEditTicketModal] = useState<{
    state: boolean;
    id: number | null;
  }>({ state: false, id: null });


  const closeAddAccount = () => setAddTicketmodal(false)

  useEffect(() => {

    getAllUsers(filter);
    console.log('auxilio')

  }, [filter, setAddTicketmodal]);

  //@ts-ignore
  let totalItems = allTickets?.length
  let totalPages = 1
  let currentPage = 1
  return (
    <div>
      <Breadcrumb
        icon={<UserCircleIcon className="h-6 text-gray-500" />}
        paths={paths}
      />
      <GenericTable
        tableData={tableData}
        tableTitles={tableTitles}
        loading={isLoading}
        searching={searching}
        actions={actions}
        rowAction={rowAction}
        //filterComponent={{ availableFilters, filterAction }}
        paginateComponent={
          <Paginate
            action={(page: number) => setFilter({ ...filter, page })}
            data={{ totalItems, currentPage, totalPages }}
          />
        }
      />

      {addTicketmodal && (
        <Modal state={addTicketmodal} close={setAddTicketmodal}>
          <NuevoTicketModal
            
            setContactModal={setContactModal}
            close={closeAddAccount}
            contactModal={contactModal}
            setNuevoTicketModal={setNuevoTicketModal}
            nuevoTicketModal={nuevoTicketModal}
          />
        </Modal>
      )}
      {editTicketModal.state && (
        <Modal
          state={editTicketModal.state}
          close={close}
          size="m"
        >
          <EditUserContainer
            id={editTicketModal.id}
            editUser={editUser}
            deleteUser={deleteUser}
            isFetching={isFetching}
            closeModal={close}
          />
        </Modal>)}

      {/*exportModal && (
      //            <Modal state={exportModal} close={setExportModal}>
      //              <ExcelFileExport
      //                filter={filter}
      //                closeModal={() => setExportModal(false)}
      //              />
      //            </Modal>
      //          */}

    </div>
  );

  /*interface ExportContainer {
            filter: BasicType;
            closeModal: Function;
          }*/

  /*const ExcelFileExport = ({ filter, closeModal }: ExportContainer) => {
            const { handleSubmit, control } = useForm();
            const { exportClients, isLoading } = useServerClients();
          
            const onSubmit: SubmitHandler<Record<string, string>> = (data) => {
              exportClients(filter, data.name, closeModal());
            };
          
            return (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  name="name"
                  label="Nombre del archivo"
                  placeholder="Nombre del archivo .xlsx"
                  control={control}
                  rules={{ required: "Debe indicar un nombre para el archivo" }}
                />
                <div className="flex py-2 justify-end">
                  <Button
                    type="submit"
                    name="Exportar"
                    color="slate-600"
                    loading={isLoading}
                    disabled={isLoading}
                  />
                </div>
              </form>
            );*/
};

export default Tickets;
