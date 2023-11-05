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
import { saveItems } from "../store/slices/ticketSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { BasicType } from "../interfaces/LocalInterfaces";

const useServerUser = () => {
  const { manageErrors } = useServer();
  const [render, setRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<Array<TicketsInterface>>([]);
  const [allTickets, setAllTickets] = useState <AccountData>();
  const [user, setUser] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.ticket.items)


  const getAllUsers = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/account/all${generateUrlParams(filter)}`)
      .then((resp) => {
        const data = resp.data;
        const data1 = data.data
        dispatch(saveItems(data1))
        setAllTickets(data1);

      })
      .catch((error) => manageErrors(error));
    setIsLoading(false);
  };
  const addUser = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/account/register", data)
      .then((resp) => {
        
        console.log(resp.data.data)
        console.log(items)
        dispatch(saveItems([...items, resp.data.data]))
        //setAllTickets();
        
        toast.success("Ticket agregado satisfactoriamente");
      }).then(()=>close())
      .catch((e) => manageErrors(e));
    setIsFetching(false);
    setIsLoading(false)
  };

  const editUser = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .put(`/account/update/${id}`, data)
      .then((resp) => {
        const newUsers:any = [...items];
        const idx = newUsers.findIndex((user:any) => user.id === id);
        newUsers.splice(idx, 1, data);
        console.log(newUsers)
        dispatch(saveItems(newUsers))
        callback && callback();
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getUser = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/account/findById/${id}`)
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
      .deleteAPI(`/account/delete/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newUsers = items.filter((item:any) => item.id !== id);
        dispatch(saveItems(newUsers))
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
    setAllUsers,
    resetUserPsw,
    manageErrors,
    modalWaitingError,
    setRender,
    render
  };
};
export default useServerUser;
