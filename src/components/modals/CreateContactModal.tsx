import Input from "../forms/Input";
import { useForm } from "react-hook-form";


const CreateContactModal = (
) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    console.log("submit");
  };

  return (
    <main>
      <form className="relative" action="submit"></form>
        <h3 className="p-4 text-xl md:text-2xl">Nuevo Contacto</h3>
        <form
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="Cliente"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Cliente"
            type={"text"}
          />
          <Input
            name="Cargo"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Cargo"
            type={"text"}
          />
          <Input
            name="Telefono"
            control={control}
            rules={{ required: "Campo requerido" }}
            label="Telefono"
            type={"number"}
          />
          <div className="relative rounded-lg self-center lg:self-end w-[100%] lg:w-[30%] h-[40px] items-center justify-center flex mt-8 bg-indigo-600  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <button type="button" className=" w-full h-full">
              Crear
            </button>
          </div>
        </form>
    </main>
  );
};

export default CreateContactModal;
