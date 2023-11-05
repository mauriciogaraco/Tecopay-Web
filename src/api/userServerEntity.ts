import { useState } from "react";
import {
  PaginateInterface,
  AccountData,
  TicketsInterface,
  UserInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { Flip, toast } from "react-toastify";
import { updateUserState } from "../store/slices/initSlice";
import { saveEntity } from "../store/slices/EntitySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { BasicType } from "../interfaces/LocalInterfaces";

const useServerEntity = () => {
  const { manageErrors } = useServer();
  const [render, setRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<Array<TicketsInterface>>([]);
  const [allTickets, setAllTickets] = useState <AccountData>();
  const [entity, setEntity] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.Entity.Entity)


  const getAllEntity = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/entity/all${generateUrlParams(filter)}`)
      .then((resp) => {
        const data = resp.data;
        const data1 = data.data
        dispatch(saveEntity(data1))
        setAllTickets(data1);

      })
      .catch((error) => manageErrors(error));
    setIsLoading(false);
  };
  const addEntity = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/entity/register", data)
      .then((resp) => {
        
        console.log(resp.data.data)
        console.log(items)
        dispatch(saveEntity([...items, resp.data.data]))
        //setAllTickets();
        
        toast.success("Entidad agregada satisfactoriamente");
      })
      .catch((e) => manageErrors(e));
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
      .put(`/entity/update/${id}`, data)
      .then((resp) => {
        const newUsers:any = [...items];
        const idx = newUsers.findIndex((user:any) => user.id === id);
        newUsers.splice(idx, 1, data);
        console.log(newUsers)
        dispatch(saveEntity(newUsers))
        callback && callback();
        toast.success("Entidad editada satisfactoriamente");
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getEntity = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/entity/findById/${id}`)
      .then((resp) => {
        setEntity(resp.data);
        console.log(resp.data)
      })
      .catch((error) => manageErrors(error));
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
        callback && callback();
        toast.success("Actualización exitosa");
      })
      .catch((error) => manageErrors(error));
    setIsFetching(false);
  };

  const updateMyEntity = (
    data: Partial<UserInterface>,
    closeModal?: Function
  ) => {
    setModalWaiting(true);
    const userID = data.id;
    delete data.id;
    query
      .patch(`/control/user/${userID}`, data)
      .then(async (resp) => {
        dispatch(updateUserState(resp.data));
        setWaiting(false);
        toast.success("Actualización exitosa", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        let errorMsg = "";
        if (error.response?.data?.message) {
          errorMsg = error.response?.data?.message;
        } else {
          errorMsg = "Ha ocurrido un error. Contacte al administrador";
        }
        toast.error(errorMsg, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
        setIsLoading(false);
      });
  };

  const deleteEntity = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/entity/delete/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newUsers = items.filter((item:any) => item.id !== id);
        dispatch(saveEntity(newUsers))
        callback && callback();
      })
      .catch((error) => manageErrors(error));
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
    updateMyEntity,
    deleteEntity,
    setAllUsers,
    manageErrors,
    modalWaitingError,
  };
};
export default useServerEntity;
