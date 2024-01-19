import { useState } from "react";
import {
  type PaginateInterface,
  type AccountData,
  type TicketsInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { toast } from "react-toastify";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";

const useServerCategories = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<TicketsInterface[]>([]);
  const [allTickets, setAllTickets] = useState <AccountData>();
  const [entity, setEntity] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [allEntity, setAllEntity] = useState<any>([])
  const [allCategories, setAllCategories] = useState<any>([])
  const [business, setBusiness] = useState<any>([])

  //Postman -> all?
  const getAllEntity = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/entity${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });

        setAllEntity(resp.data.items)



      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  //Postman -> register
  const addCategory = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/categories", data)
      .then((resp) => {
        allCategories([...allCategories, resp.data])
       toast.success("Categoria agregada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  //Postman -> update
  const editEntity = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/entity/${id}`, data)
      .then((resp) => {
        const newUsers:any = [...allEntity];
        const dataWithId = Object.assign(data, {id:id})
        const idx = newUsers.findIndex((user:any) => user.id === id);
        newUsers.splice(idx, 1, dataWithId);
        setAllEntity(newUsers)
        //dispatch(saveEntity(newUsers))
        callback?.();
        toast.success("Entidad editada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };
  //Postman -> find by id
  const getEntity = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/entity/${id}`)
      .then((resp) => {
        setEntity(resp.data);
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

  const updateEntity = async (
    userId: number,
    data: BasicType,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/control/user/${userId}`, data)
      .then(async (resp) => {
        setEntity(resp.data);
        const newUsers = [...allUsers];
        const idx = newUsers.findIndex((user) => user.id === userId);
        newUsers.splice(idx, 1, resp.data);
        setAllUsers(newUsers);
        callback?.();
        toast.success("Actualización exitosa");
      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };
  //Postman -> delete
  const deleteEntity = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/entity/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newUsers = allEntity.filter((item:any) => item.id !== id);
        setAllEntity(newUsers)
        callback?.();
      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };
  //Postman -> setBusiness?
  const getAllBussinnes = async () => {
    setIsLoading(true);
    await query
      .get(`/business`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        setBusiness(resp.data.items)
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

 
  return {
    allCategories,
    addCategory,
  };
};
export default useServerCategories;
