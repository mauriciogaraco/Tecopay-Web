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
import { TicketsInterface, UserInterface } from "../../../interfaces/ServerInterfaces";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/modals/GenericModal";
import AlertContainer from "../../../components/misc/AlertContainer";
import { BasicType } from "../../../interfaces/InterfacesLocal";
import TextArea from "../../../components/forms/TextArea";
import Select from "../../../components/forms/Select";

interface EditInterface {
  user: TicketsInterface | null;
  editUser: Function;
  deleteUser: Function;
  closeModal: Function;
  isFetching: boolean;
}
const selectData = [{ id: 1, name:'abierto' }, { id: 2, name: 'cerrado' }]

const DetailUserEditComponent = ({
  editUser,
  deleteUser,
  user,
  closeModal,
  isFetching,
}: EditInterface) => {
  const { control, handleSubmit, watch, reset, formState } = useForm<BasicType>(
    {
      mode: "onChange",

    }
  );
  const { isFetching: loadingPsw } = useServerUser();
  const { isFetching: fetchingUser } = useServerUser();
  const { isFetching: fetchingMail } = useServerUser();
  const [delAction, setDelAction] = useState(false);

  const onSubmit: SubmitHandler<BasicType> = (data) => {
    editUser(user?.id, deleteUndefinedAttr(data), reset());
  };

  const email = watch("email") ?? user?.email ?? null;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-96 overflow-auto scrollbar-thin scrollbar-thumb-slate-100 pr-5 pl-2">
          <div className="flex justify-end">
            <div className="bg-red-200 hover:bg-red-300 transition-all duration-200 ease-in-out  rounded-lg"><Button
              icon={<TrashIcon className="h-5 text-gray-700" />}
              color="gray-500"
              action={() => setDelAction(true)}
              outline
            /></div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="name"
              defaultValue={user?.name}
              label="Cliente"
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
              defaultValue={user?.contact_id}
              name="contact_id"
              label="Contacto"
              control={control}
              rules={{ required: "Campo requerido" }}
            />
            <Input
              name="classification"
              label="classification"
              defaultValue={user?.classification}
              control={control}
              rules={{
                required: 'Campo requerido'
                //validate: {
                //validateEmail: (value) =>
                //validateEmail(value) || "Dirección de correo inválida",
                //checkEmail: async (value) => {
                //if (formState.dirtyFields.email) {


                //} else {
                //return true;
                //}
                //},
                // },
              }}

            />
            <Input
              defaultValue={user?.priority}
              name="priority"
              label="Prioridad"
              control={control}
              rules={{ required: "Campo requerido" }}
            />
          </div>
          <Select
          name="status"
            label="Estado"
            data={selectData}
            control={control}></Select>
          <TextArea

            defaultValue={user?.description}
            name="description"
            control={control}
            label="descripcion"
          ></TextArea>

          <div className="flex justify-end mt-5">
            <Button
              name="Actualizar"
              color="slate-600"
              type="submit"
              loading={isFetching}
              disabled={isFetching || loadingPsw}
            />
          </div>
        </div>
      </form>

      {delAction && (
        <Modal state={delAction} close={setDelAction}>
          <AlertContainer
            onAction={() => deleteUser(user?.id, closeModal)}
            onCancel={setDelAction}
            title={`Eliminar ${user?.name}`}
            text="¿Seguro que desea eliminar este usuario del sistema?"
            loading={isFetching}
          />
        </Modal>
      )}
    </>
  );
};

export default DetailUserEditComponent;
