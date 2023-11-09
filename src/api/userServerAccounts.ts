import { useState } from "react";
import type {
  PaginateInterface,
  AccountData,
  TicketsInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import {  toast } from "react-toastify";

import { saveItems } from "../store/slices/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { generateUrlParams } from "../utils/helpers";
import type { BasicType } from "../interfaces/LocalInterfaces";

const useServerAccounts = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allAccounts, setAllAccounts] = useState<TicketsInterface[]>([]);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.account.items)


  const getAllAccounts = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/account/all${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        setAllAccounts(resp.data.items)


      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  const addAccount = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/account/register", data)
      .then((resp) => {   
        dispatch(saveItems([...items, resp.data.data]))
        // setAllTickets();
        
        toast.success("Ticket agregado satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  const editAccount = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .put(`/account/update/${id}`, data)
      .then((resp) => {
        const newAccounts:any = [...items];
        const idx = newAccounts.findIndex((user:any) => user.id === id);
        newAccounts.splice(idx, 1, data);
        setAllAccounts(newAccounts)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getAccount = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/account/findById/${id}`)
      .then((resp) => {
        setAccount(resp.data);
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };


  const deleteAccount = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/account/delete/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newAccounts = items.filter((item:any) => item.id !== id);
        setAllAccounts(newAccounts)
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
    allAccounts,
    account,
    getAllAccounts,
    addAccount,
    getAccount,
    editAccount,
    deleteAccount,
    setAllAccounts,
    manageErrors,
    modalWaitingError,

  };
};
export default useServerAccounts;
