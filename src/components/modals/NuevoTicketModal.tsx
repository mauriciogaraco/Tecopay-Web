import CreateContactModal from "./CreateContactModal";
import addUser from '../../api/userServerUser'
import { SubmitHandler, useForm } from "react-hook-form";
import ComboBox from "../forms/Combobox";
import TicketAsyncComboBox from "../forms/TicketAsyncCombobox";
import TextArea from "../forms/TextArea";
import { SelectInterface } from "../../interfaces/LocalInterfaces";
import { useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import Modal from "../misc/GenericModal";
import { saveContactoSelection } from "../../store/slices/ticketSlice";
import { useAppDispatch } from "../../store/hooks";
import { deleteUndefinedAttr } from "../../utils/helpers";
import Input from "../forms/Input";
import Select from "../forms/Select";
import Toggle from "../forms/Toggle";

interface propsDestructured {
  setContactModal: (contactModal: boolean) => void;
  contactModal: boolean;
  setNuevoTicketModal: (contactModal: boolean) => void;
  nuevoTicketModal: boolean;
}


const prioridad: SelectInterface[] = [
  { id: "1", name: "baja" },
  { id: "2", name: "media" },
  { id: "3", name: "alta" },
];

const clasificacion: SelectInterface[] = [
  { id: "1", name: "Conectividad" },
  { id: "2", name: "Plataforma Web" },
  { id: "3", name: "Aplicaciones Móviles" },
  { id: "4", name: "Servidores" },
];



const NuevoTicketModal = ({
  setContactModal,
  contactModal,
}: propsDestructured) => {
  const { control, handleSubmit } = useForm();


  const ContactoName = useAppSelector((state) => state.ticket.Contacto.name);
  const ClasificacionName = useAppSelector(
    (state) => state.ticket.Clasificacion.name
  );

  const dipatch = useAppDispatch();
  useEffect(() => {
    if (ContactoName === "Nuevo Contacto") {
      setContactModal(true);
    }
  }, [ContactoName]);
  const onSubmit: SubmitHandler<Record<string, string | number | boolean | string[]>> = (
    data
  ) => {
    console.log('hecho');
  };

  const closeContactModal = () => {
    setContactModal(false);
    dipatch(saveContactoSelection({ id: "", name: "" }));
  };




  return (
    <main>
      <div>
        <h3 className="p-4 text-xl md:text-2xl">Nueva cuenta</h3>
        <form
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >

          <Input
            name="name"
            label="Nombre"
            placeholder="Nombre de la cuenta"
            control={control}
            rules={{ required: "Campo requerido" }}></Input>

          <TicketAsyncComboBox
            name="contact_id"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Entidad"
            dataQuery={{ url: "users" }}
            normalizeData={{ id: 1, name: "boy" }}
          ></TicketAsyncComboBox>

          <Select
            name="currency"
            control={control}
            label="Moneda" data={[{ id: 1, name: 'CUP' }, { id: 2, name: 'MLC' }, { id: 3, name: 'USD' }, { id: 4, name: 'EUR' },]}></Select>


          <TicketAsyncComboBox
            name="propietary"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Propietario"
            dataQuery={{ url: "users" }}
            normalizeData={{ id: 1, name: "boy" }}
          ></TicketAsyncComboBox>



          <div className="h-full"><TextArea
            name="address"

            control={control}
            label="Direccion"
          ></TextArea>


            <TextArea
              name="description"
              control={control}
              paddingInput="py-0"
              label="Descripcion"
            ></TextArea></div>

          <div className="flex gap-5"><Toggle name="active" title="Cuenta privada" control={control}></Toggle>
            <Toggle name="active" title="Cuenta activa" control={control}></Toggle>
          </div>
          <div className="relative rounded-lg self-center lg:self-end w-[100%] lg:w-[30%] h-[40px] items-center justify-center flex mt-8 bg-indigo-600  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <button type="submit" className=" w-full h-full">
              Insertar
            </button>
          </div>
        </form>
      </div>
      {contactModal ? (
        <Modal state={contactModal} close={closeContactModal}>
          <CreateContactModal></CreateContactModal>
        </Modal>
      ) : null}
    </main>
  );
};

export default NuevoTicketModal;
