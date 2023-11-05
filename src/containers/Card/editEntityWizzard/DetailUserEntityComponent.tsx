import { useState } from "react";
import Input from "../../../components/forms/Input";
import Button from "../../../components/misc/Button";
import {
  deleteUndefinedAttr,
  validateEmail,
} from "../../../utils/helpers";
import Toggle from "../../../components/forms/Toggle";
import { SubmitHandler, useForm } from "react-hook-form";
import useServerUser from "../../../api/userServerUser";
import { AccountData, UserInterface } from "../../../interfaces/ServerInterfaces";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/modals/GenericModal";
import AlertContainer from "../../../components/misc/AlertContainer";
import { BasicType, SelectInterface } from "../../../interfaces/InterfacesLocal";
import TextArea from "../../../components/forms/TextArea";
import Select from "../../../components/forms/Select";
import ComboBox from "../../../components/forms/Combobox";
import AsyncComboBox from "../../../components/forms/AsyncCombobox";

interface EditInterface {
  Entity: any
  editEntity: Function;
  deleteUser: Function;
  closeModal: Function;
  isFetching: boolean;
  id: number | null;
}
const selectData = [{ id: 1, name: true }, { id: 2, name: 'cerrado' }]
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

const DetailEntityEditComponent = ({
  editEntity,
  deleteUser,
  Entity,
  closeModal,
  isFetching,
  id
}: EditInterface) => {
  const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
    {
      mode: "onChange",

    }
  );
  const [delAction, setDelAction] = useState(false);


  const onSubmit: SubmitHandler<BasicType> = (data) => {
    const date = Entity?.data.createdAt
    const WholeData = Object.assign(data, { userId: 1, id:id, createdAt:date })
    console.log(id)
    editEntity(Entity?.data.id, deleteUndefinedAttr(WholeData), reset()).then(() => closeModal());
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-96 overflow-auto scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2">
          <div className="flex justify-end">
            <div className="bg-red-200 hover:bg-red-300 transition-all duration-200 ease-in-out  rounded-lg"><Button
              icon={<TrashIcon className="h-5 text-gray-700" />}
              color="gray-500"
              type="button"
              action={() => setDelAction(true)}
              outline
            /></div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="name"
              defaultValue={Entity?.data.name}
              label="Nombre"
              control={control}
              rules={{
                required: "Campo requerido",
                //         validate: {
                //           validateChar: (value) =>
                //             validateUserChar(value) ||
                //             "El usuario no puede contener espacios ni caracteres especiales excepto - _ .",
                //
                //             },
              }}
            />

            <Input
              name="phone"
              label="Telefono"
              defaultValue={Entity?.data.phone}
              placeholder="Telefono"
              control={control}
              rules={{ required: "Campo requerido" }}></Input>

            <AsyncComboBox
              name="currencyId"
              defaultItem={Entity ? { id: Entity?.data.id, name: Entity?.data.currencyId } : undefined}
              defaultValue={Entity?.data.currencyId}
              control={control}
              rules={{ required: "Campo requerido" }}
              label="Moneda"
              dataQuery={{ url: "/currency/all" }}
              normalizeData={{ id: 'id', name: "code" }}
            ></AsyncComboBox>
            <Select name="status" control={control} defaultValue={Entity?.data.status} default={Entity?.data.status} label="Estado de la entidad" data={[{id:1, name:'ACTIVA'},{id:2, name:'INACTIVA'}]} ></Select>


          </div>
          <div className="flex py-5 justify-around gap-5">

          </div>
          <TextArea

            defaultValue={Entity?.data.address}
            name="address"
            control={control}
            label="Direccion"
          ></TextArea>

          
          <div className="flex justify-end mt-5">
            <Button
              name="Actualizar"
              color="slate-600"
              type="submit"
              loading={isFetching}
              disabled={isFetching}
            />
          </div>
        </div>
      </form>

      {delAction && (
        <Modal state={delAction} close={setDelAction}>
          <AlertContainer
            onAction={() => deleteUser(Entity?.data.id, closeModal)}
            onCancel={setDelAction}
            title={`Eliminar ${Entity?.data.name}`}
            text="¿Seguro que desea eliminar este usuario del sistema?"
            loading={isFetching}
          />
        </Modal>
      )}
    </>
  );
};

export default DetailEntityEditComponent;
