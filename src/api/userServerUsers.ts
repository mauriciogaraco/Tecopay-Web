import { useState } from "react";
import type {
  PaginateInterface,
  TicketsInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import {  toast } from "react-toastify";


import { generateUrlParams } from "../utils/helpers";
import type { BasicType } from "../interfaces/LocalInterfaces";

import { Item, Items } from "../interfaces/UsersInterfaces";

const useServerUsers = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allUsers, setAllUsers] = useState<Items>([]);
  const [user, setUser] = useState<Item | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [selectedDataToParent, setSelectedDataToParent] =
  useState<any>(null);
  const [selectedDataToParentTwo, setSelectedDataToParentTwo] =
  useState<any>(null);
  const [waiting, setWaiting] = useState<boolean>(false);


  const getAllUsers = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/user${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        setAllUsers(resp.data.items)


      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  const registerUser = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/user/register", data)
      .then((resp) => {   
        
   setAllUsers([...allUsers, resp.data])
        
        toast.success("Usuario registrado satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  const addFromTecopos = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/user/add_from_identity", data)
      .then((resp) => {   
        
   setAllUsers([...allUsers, resp.data])
        
        toast.success("Usuario registrado satisfactoriamente");
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
      .patch(`/user/${id}`, data)
      .then((resp) => {
        const newUsers:any = [...allUsers];
        const idx = newUsers.findIndex((user:any) => user.id === id);
        newUsers.splice(idx, 1, resp.data);      
        setAllUsers(newUsers)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getUser = async (id: any): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await query.get(`/user/${id}`);
      const user = response.data;
      setUser(user);
  
  
      return user;
    } catch (error) {
      console.error(error);
      // Display a user-friendly error message.
    } finally {
      setIsLoading(false);
    }
  };
  

  const deleteUser = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/user/${id}`, {})
      .then(() => {
        toast.success("Usuario Eliminado con éxito");
        const newUsers = allUsers.filter((item:any) => item.id !== id);
        setAllUsers(newUsers)
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
    user,
    getAllUsers,
    registerUser,
    getUser,
    editUser,
    deleteUser,
    setAllUsers,
    manageErrors,
    modalWaitingError,
    addFromTecopos,

  };
};
export default useServerUsers;
