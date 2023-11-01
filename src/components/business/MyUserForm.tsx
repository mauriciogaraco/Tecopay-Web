import { useForm, SubmitHandler } from "react-hook-form";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownOnSquareStackIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { UserInterface } from "../../interfaces/ServerInterfaces";

interface UserFormProps {
  closeModal: Function;
  action: Function;
  isFetching: boolean;
  initialValues?: Partial<UserInterface> | null;
  
}

interface Password{
    password?:string,
    validatePassword?:string
}

export default function UserForm({
  closeModal,
  action,
  isFetching,
  initialValues,
}: UserFormProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields},
    getValues
  } = useForm<Partial<UserInterface>&Password>({
    mode: "onTouched",
    defaultValues: {
      displayName: initialValues?.displayName,
      username: initialValues?.username,
      id:initialValues?.id
    },
  });

  const onSubmit: SubmitHandler<Partial<UserInterface>&Password> = (data) => {
    const {password} = data;
    if (password === "") {
        delete data.password;              
    }
    delete data.validatePassword;
    action(data , closeModal)
  };    


  return (
    <>
      <div className="flex justify-between md:justify-center mb-4">
        <h3 className="md:text-lg text-md font-medium leading-6 text-gray-900">
          Editar mi Usuario
        </h3>
      </div>

      <form
        className="space-y-8 divide-y divide-gray-300"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-1 sm:space-y-5">
          <div className="pt-2">
            <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-2 md:grid-cols-12">
              {/*DISPLAY NAME */}
              <div className="relative md:col-span-7">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre Completo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                      errors.displayName &&
                      "text-red-700 border-red-600 border-2"
                    }`}
                    tabIndex={-1}
                    {...register("displayName", {
                      required: "Campo Requerido",
                    })}
                  />
                  {errors.displayName && (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs text-red-600">
                        {errors.displayName.message}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/*USERNAME */}
              <div className="relative md:col-span-5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usuario en el Sistema
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                      errors.username && "text-red-700 border-red-600 border-2"
                    }`}
                    tabIndex={-1}
                    {...register("username", {
                      required: "Campo Requerido",
                    })}
                  />
                  {errors.username && (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs text-red-600">
                        {errors.username?.message}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/*PASSWORD */}
              <div className="md:col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nueva Contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                        errors.validatePassword &&
                        "text-red-700 border-red-600 border-2"
                      }`}
                    tabIndex={-1}
                    {...register("password")}
                  />
                   {errors.validatePassword && (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 -top-6">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs text-red-600">
                        {errors.validatePassword.message}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/*VALIDATE PASSWORD */}
              <div className="md:col-span-6">
                <label
                  htmlFor="validate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                        errors.validatePassword &&
                        "text-red-700 border-red-600 border-2"
                      }`}
                    tabIndex={-1}
                    {...register("validatePassword", {
                        validate:{
                            correct:(value)=>dirtyFields.password 
                            ? value===getValues("password")||"Las Contraseñas no coinciden"
                            : true
                            /*{
                                if(dirtyFields.password){
                                return value === getValues("password")|| "Las Contraseñas no coinciden"
                            }else{
                                return true
                            }
                        }*/
                        }
                    })}
                  />
                  {errors.validatePassword && (
                    <>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 -top-6">
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-xs text-red-600">
                        {errors.validatePassword.message}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              onClick={() => closeModal(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="relative ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 pl-8 pr-2 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-secondary"
              disabled={
                isSubmitting ||
                isFetching ||
                Object.entries(dirtyFields).length === 0
              }
            >
              {isSubmitting || isFetching ? (
                <svg
                  className="absolute left-2 animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : initialValues ? (
                <PencilIcon className="absolute left-2 w-5 h-5" />
              ) : (
                <ArrowDownOnSquareStackIcon className="absolute left-2 w-5 h-5" />
              )}
              <span className="ml-1">
                {isSubmitting || isFetching
                  ? "Enviando..."
                  : initialValues
                  ? "Guardar"
                  : "Insertar"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
