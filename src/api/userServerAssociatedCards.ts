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
import { saveAccount } from "../store/slices/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";

const useServerUser = () => {
  const { manageErrors } = useServer();
  const [render, setRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<TicketsInterface[]>([]);
  const [allTickets, setAllTickets] = useState <AccountData>();
  const [user, setUser] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.account.items)


  const getAllUsers = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/account/all${generateUrlParams(filter)}`)
      .then((resp) => {
        const data = resp.data;
        const data1 = data.data
        dispatch(saveAccount(data1))
        setAllTickets(data1);

      })
      .catch((error) => { manageErrors(error); });
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
        dispatch(saveAccount([...items, resp.data.data]))
        // setAllTickets();
        
        toast.success("Ticket agregado satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
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
        dispatch(saveAccount(newUsers))
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
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
      .catch((error) => { manageErrors(error); });
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
        callback?.();
        toast.success("Actualización exitosa");
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
    user,
    setAllTickets,
    allTickets,
    getAllUsers,
    addUser,
    getUser,
    editUser,
    updateUser,
    setAllUsers,

    manageErrors,
    modalWaitingError,
    setRender,
    render
  };
};
export default useServerUser;
