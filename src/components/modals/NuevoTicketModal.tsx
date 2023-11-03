import CreateContactModal from "./CreateContactModal";
import useServerUser from '../../api/userServerUser'
import { SubmitHandler, useForm } from "react-hook-form";
import ComboBox from "../forms/Combobox";
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
import AsyncComboBox from "../forms/AsyncCombobox";
import Button from "../misc/Button";

interface propsDestructured {
  setContactModal: (contactModal: boolean) => void;
  contactModal: boolean;
  setNuevoTicketModal: (contactModal: boolean) => void;
  nuevoTicketModal: boolean;
  close: Function
}




const NuevoTicketModal = ({
  setContactModal,
  close,
}: propsDestructured) => {
  const { control, handleSubmit } = useForm();


  const ContactoName = useAppSelector((state) => state.ticket.Contacto.name);
  const ClasificacionName = useAppSelector(
    (state) => state.ticket.Clasificacion.name
  );

  const onSubmit: SubmitHandler<Record<string, string | number | boolean | string[]>> = (
    data
  ) => {
    const sendData = Object.assign(data, { isBlocked: false, code: "123456", issueEntityId: 3, ownerId: 251, })
    console.log(sendData);
    try {
      addUser(deleteUndefinedAttr(sendData), close).then(() => close()).then(() => setRender(true))
    } catch (error) {

    }

  };


  const { isLoading, addUser, getAllUsers, setRender} = useServerUser()



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

          <AsyncComboBox
            name="contact_id"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Entidad"
            dataQuery={{ url: "/entity/all" }}
            normalizeData={{ id: 'id', name: "name" }}
          ></AsyncComboBox>

          <AsyncComboBox
            name="currencyId"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Moneda"
            dataQuery={{ url: "/currency/all" }}
            normalizeData={{ id: 'id', name: "symbol" }}
          ></AsyncComboBox>


          <AsyncComboBox
            name="propietary"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Propietario"
            dataQuery={{ url: "/account/all" }}
            normalizeData={{ id: 'id', name: "ownerId" }}
          ></AsyncComboBox>



          <div className="h-full"><TextArea
            name="address"
            rules={{ required: "Campo requerido" }}
            control={control}
            label="Direccion"
          ></TextArea>


            <TextArea
              name="description"
              rules={{ required: "Campo requerido" }}
              control={control}
              paddingInput="py-0"
              label="Descripcion"
            ></TextArea></div>

          <div className="flex gap-5"><Toggle name="isPrivate" title="Cuenta privada" control={control}></Toggle>
            <Toggle name="isActive" title="Cuenta activa" control={control}></Toggle>
          </div>
          <div className="relative rounded-lg self-center lg:self-end w-[100%] lg:w-[30%] h-[40px] items-center justify-center flex mt-8 bg-indigo-600  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Button loading={isLoading} color="blue-500" name="Insertar" type="submit"></Button>
          </div>
        </form>
      </div>

    </main>
  );
};

export default NuevoTicketModal;
