import { useState } from "react";
import type {
  PaginateInterface,
  AccountData,
  TicketsInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import {  toast } from "react-toastify";

import { saveAccount } from "../store/slices/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { generateUrlParams } from "../utils/helpers";
import type { BasicType } from "../interfaces/LocalInterfaces";
import { SelectInterface } from "../interfaces/InterfacesLocal";
import { da } from "date-fns/locale";

const useServerAccounts = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [account, setAccount] = useState<any | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [selectedDataToParent, setSelectedDataToParent] =
  useState<any>(null);
  const [selectedDataToParentTwo, setSelectedDataToParentTwo] =
  useState<any>(null);
  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.account.items)


  const getAllAccounts = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/account${generateUrlParams(filter)}`)
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
    .post("/account", data)
      .then((resp) => {   
   setAllAccounts([...allAccounts, resp.data])
        
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
      .patch(`/account/${id}`, data)
      .then((resp) => {
        const newAccounts:any = [...allAccounts];
        const idx = newAccounts.findIndex((user:any) => user.id === id);
        const accountWithId = allAccounts.find((card:any) => card.id == id);
        const wholeData = Object.assign(data, {id, issueEntity:{name: selectedDataToParentTwo?.name}, owner:{fullName:accountWithId?.owner.fullName}, currency: {code: selectedDataToParent?.name}} )
        console.log(resp.data)
        newAccounts.splice(idx, 1, resp.data);        
        setAllAccounts(newAccounts)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getAccount = async (id: any): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await query.get(`/account/${id}`);
      const account = response.data;
      setAccount(account);
  
  
      return account;
    } catch (error) {
      console.error(error);
      // Display a user-friendly error message.
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteAccount = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/account/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newAccounts = allAccounts.filter((item:any) => item.id !== id);
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
    setSelectedDataToParent,
    selectedDataToParent,
    setSelectedDataToParentTwo

  };
};
export default useServerAccounts;
