import { useState } from "react";
import {
  type PaginateInterface,
  type AccountData,
  type TicketsInterface,
  type UserInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { Flip, toast } from "react-toastify";
import { saveEntity } from "../store/slices/EntitySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";

const useServerEntity = () => {
  const { manageErrors } = useServer();
  const [render, setRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<TicketsInterface[]>([]);
  const [allTickets, setAllTickets] = useState <AccountData>();
  const [entity, setEntity] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const [allEntity, setAllEntity] = useState<any>([])


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
  const addEntity = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/entity", data)
      .then((resp) => {
      
       setAllEntity([...allEntity, resp.data])
        // setAllTickets();
        
        toast.success("Entidad agregada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  const editEntity = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .put(`/entity/${id}`, data)
      .then((resp) => {
        const newUsers:any = [...allEntity];
        const dataWithId = Object.assign(data, {id:id})
        const idx = newUsers.findIndex((user:any) => user.id === id);
        newUsers.splice(idx, 1, dataWithId);
        console.log(newUsers)
        setAllEntity(newUsers)
        //dispatch(saveEntity(newUsers))
        callback?.();
        toast.success("Entidad editada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

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
  return {
    paginate,
    isLoading,
    isFetching,
    waiting,
    modalWaiting,
    allUsers,
    entity,
    setAllTickets,
    allTickets,
    getAllEntity,
    addEntity,
    getEntity,
    editEntity,
    updateEntity,
    deleteEntity,
    setAllUsers,
    manageErrors,
    modalWaitingError,
    allEntity,
    setAllEntity
  };
};
export default useServerEntity;
