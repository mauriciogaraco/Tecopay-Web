import { useState } from "react";
import {
  PaginateInterface,
  TicketData,
  TicketsInterface,
  UserInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { Flip, toast } from "react-toastify";
import { updateUserState } from "../store/slices/initSlice";
import { saveItems } from "../store/slices/ticketSlice";
import { useAppDispatch } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { BasicType } from "../interfaces/LocalInterfaces";

const useServerUser = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<Array<TicketsInterface>>([]);
  const [allTickets, setAllTickets] = useState<TicketData>();
  const [user, setUser] = useState<TicketsInterface | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const addUser = async (data: BasicType, callback: Function) => {
    setIsFetching(true);
    await query
      .post("/tickets", data)
      .then(async (resp) => {
        setAllUsers([resp.data, ...allUsers]);
        callback && callback();
      })
      .catch((error) => manageErrors(error));
    setIsFetching(false);
  };

  const getAllUsers = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/tickets${generateUrlParams(filter)}`)
      .then((resp) => {
        const data = resp.data;
        dispatch(saveItems(data))
        setAllTickets(data);
      })
      .catch((error) => manageErrors(error));
    setIsLoading(false);
  };

  const editUser = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/tickets/${id}`, data)
      .then((resp) => {
        const newUsers = [...allUsers];
        const idx = newUsers.findIndex((user) => user.id === id);
        newUsers.splice(idx, 1, resp.data);
        setAllUsers(newUsers);
        console.log(newUsers, resp.data);
        toast.success("Cambios realizados con éxito");
        callback && callback();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getUser = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/tickets/${id}`)
      .then((resp) => {
        setUser(resp.data);
        console.log(resp.data)
      })
      .catch((error) => manageErrors(error));
    setIsLoading(false);
  };

  const updateUser = async (
    userId: number,
    data: BasicType,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/control/user/${userId}`, data)
      .then(async (resp) => {
        setUser(resp.data);
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

  const updateMyUser = (
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

  const resetUserPsw = async (email: string, callback?: Function) => {
    setIsFetching(true);
    await query
      .post(`/control/user/request-password`, { email })
      .then(() => {
        toast.success("Operación completada con éxito");
        callback && callback();
      })
      .catch((error) => manageErrors(error));
    setIsFetching(false);
  };

  const deleteUser = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/tickets/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newUsers = allUsers.filter((user) => user.id !== id);
        setAllUsers(newUsers);
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
    user,
    setAllTickets,
    allTickets,
    getAllUsers,
    addUser,
    getUser,
    editUser,
    updateUser,
    updateMyUser,
    deleteUser,
    resetUserPsw,
    manageErrors,
    modalWaitingError,
  };
};
export default useServerUser;
