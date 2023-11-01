import Button from "../../../components/misc/Button";
/*import { useForm, SubmitHandler } from "react-hook-form";
import { SelectInterface } from "../../../../interfaces/InterfacesLocal";
import { UserInterface } from "../../../../interfaces/ServerInterfaces";
import { useAppSelector } from "../../../../store/hooks";
import { deleteUndefinedAttr } from "../../../../utils/helpers";
import MultiSelect from "../../../../components/forms/Multiselect";


interface EditRolesInterface {
  user: UserInterface | null;
  editUser: Function;
}

*/const UserRolesComponent = /*({ editUser, user }: EditRolesInterface) */()=> {
  /*const { roles, areas } = useAppSelector((state) => state.nomenclator);
  const { handleSubmit, control, watch } = useForm();

  const onSubmit: SubmitHandler<
    Record<string, string | number | boolean | string[]>
  > = (data) => {
    editUser(user?.id,deleteUndefinedAttr(data))
  };

  const currentRoles =
    watch && watch("roles")
      ? watch("roles")
      : user?.roles.map((item) => item.code);


  const dataRoles: SelectInterface[] = roles.map((item) => ({
    id: item.code,
    name: item.name,
  }));

  const salesAreas: SelectInterface[] = areas
    .filter((item) => item.type === "SALE")
    .map((item) => ({ id: item.id, name: item.name }));

  const productionAreas: SelectInterface[] = areas
    .filter((item) => item.type === "MANUFACTURER")
    .map((item) => ({ id: item.id, name: item.name }));

  const stockAreas: SelectInterface[] = areas
    .filter((item) => item.type === "STOCK")
    .map((item) => ({ id: item.id, name: item.name }));

  const accessPointAreas: SelectInterface[] = areas
    .filter((item) => item.type === "ACCESSPOINT")
    .map((item) => ({ id: item.id, name: item.name }));
  

  */return (/*
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-3 h-96 pt-3">
          <MultiSelect
            name="roles"
            data={dataRoles}
            label="Roles"
            control={control}
            byDefault={user?.roles.map((item) => item.code)}
          />
          {Array.isArray(currentRoles) &&
            currentRoles.some(value=> ["MANAGER_SALES","WEITRESS"].includes(value)) && (
              <MultiSelect
                name="allowedSalesAreas"
                data={salesAreas}
                label="Áreas de venta"
                control={control}
                byDefault={user?.allowedSalesAreas.map(item=>item.id)}
              />
            )}
          {Array.isArray(currentRoles) &&
            currentRoles.includes("MANAGER_PRODUCTION") && (
              <MultiSelect
                name="allowedManufacturerAreas"
                data={productionAreas}
                label="Áreas de producción"
                control={control}
                byDefault={user?.allowedManufacturerAreas.map(item=>item.id)}
              />
            )}
          {Array.isArray(currentRoles) &&
            currentRoles.includes("MANAGER_AREA") && (
              <MultiSelect
                name="allowedStockAreas"
                data={stockAreas}
                label="Almacenes"
                control={control}
                byDefault={user?.allowedStockAreas.map(item=>item.id)}
              />
            )}
          {Array.isArray(currentRoles) &&
            currentRoles.some(value=> ["MANAGER_ACCESS_POINT"].includes(value)) && (
              <MultiSelect
                name="allowedAccessPointAreas"
                data={accessPointAreas}
                label="Puntos de acceso"
                control={control}
                byDefault={user?.allowedAccessPointAreas.map(item=>item.id)}
              />
            )}
        </div>*/
            
        <div className="flex justify-end mt-5">
          <Button name="Actualizar" color="slate-600" type="submit"/>
        </div>/*
      </form>
    </>
  );
};*/
  )}
export default UserRolesComponent;
