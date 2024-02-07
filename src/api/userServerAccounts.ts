import { useState } from "react";
import type {
  PaginateInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { toast } from "react-toastify";
import { generateUrlParams } from "../utils/helpers";
import type { BasicType } from "../interfaces/LocalInterfaces";
import { fetchAccounts } from '../store/slices/accountSlice';
import { useAppDispatch } from '../store/hooks';

const useServerAccounts = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [account, setAccount] = useState<any | null>(null);
  const [records, setRecords] = useState<any | null>(null);
  const [operations, setOperations] = useState<any | null>(null);
 

  const dispatch = useAppDispatch();

  // 'account / all'
  const getAllAccounts = async (filter: BasicType) => {
    setIsLoading(true);
    try {
      let resp = await query.get(`/account${generateUrlParams(filter)}`)
      setPaginate({
        totalItems: resp.data.totalItems,
        totalPages: resp.data.totalPages,
        currentPage: resp.data.currentPage,
      });
      setAllAccounts(resp.data.items)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }

  };

  // 'account / register'
  const addAccount = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    try {
      let resp = await query.post("/account", data);
      setAllAccounts([...allAccounts, resp.data]);
      toast.success("Cuenta agregada satisfactoriamente");
      close()
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
      setIsLoading(false)
    }
  };

  // 'account / update'
  const editAccount = async (
    id: number,
    data: Record<string, string | number | boolean | (number[])>,
    callback?: Function
  ) => {
    setIsFetching(true);
    try {
      let resp = await query.patch(`/account/${id}`, data)
      const newAccounts: any = [...allAccounts];
      const idx = newAccounts.findIndex((user: any) => user.id === id);
      newAccounts.splice(idx, 1, resp.data);
      setAllAccounts(newAccounts)
      callback && callback();
      setAccount(UnifyProperties(account, resp.data));
      toast.success("Cuenta modificada con éxito");
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }

  };

  // 'account / find by id'
  const getAccount = async (id: any): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await query.get(`/account/${id}`);
      const account = response.data;
      setAccount(account);
      return account;
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 'account / getAccountRecords'
  const getAccountRecords = async (id: any): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await query.get(`/account/${id}/records`);
      const account = response.data;
      setRecords(account);
      return account;
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 'account / getAccountOp'
  const getAccountOperations = async (id: any): Promise<any> => {
    setIsLoading(true);
    try {
      const response = await query.get(`/account/${id}/operations`);
      const account = response.data;
      console.log(account)
      setOperations(account.items);
      return account;
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 'account / delete'
  const deleteAccount = async (id: number, callback?: Function) => {
    setIsFetching(true);
    try {
      await query.deleteAPI(`/account/${id}`, {})
      toast.success("Cuenta eliminada con éxito");
      const newAccounts = allAccounts.filter((item: any) => item.id !== id);
      setAllAccounts(newAccounts)
      callback && callback();
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };

  // 'account operation / transfer'
  const Transfer = async (data: any, callback?: Function) => {
    setIsFetching(true);
    try {
      let resp = await query.post(`/account/transfer`, data)
      if (resp.data.sourceAccount.address == account.address) {
        const changed = { ...account, amount: resp.data.sourceAccount.amount }
        setAccount(changed)
      }
      else if (resp.data.targetAccount.address == account.address) {
        const changed = { ...account, amount: resp.data.targetAccount.amount }
        setAccount(changed)
      }
      callback && callback();
      toast.success("Transferencia exitosa");
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };

  // 'account operation / charge'
  const Charge = async (data: any, id: number, callback?: Function) => {
    setIsFetching(true);
    try {
      await query.post(`/accountopp/charge`, data)
      dispatch(fetchAccounts({}));
      callback && callback();
      toast.success("Recarga exitosa");
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };

  // 'account operation / charge'
  const registerAccountCategory = async (data: any) => {
    setIsFetching(true);
    try {
      await query.post(`/account/assignCategory`, data)
      toast.success("Categoría registrada");
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };




  return {
    paginate,
    isLoading,
    isFetching,
    allAccounts,
    account,
    records,
    operations,
    getAllAccounts,
    addAccount,
    getAccount,
    editAccount,
    deleteAccount,
    setAllAccounts,
    manageErrors,
    getAccountOperations,
    getAccountRecords,
    Transfer,
    Charge,
    registerAccountCategory,
  };
};
export default useServerAccounts;



function UnifyProperties(objetoBase: any, nuevoObjeto: any) {
  // Obtener las propiedades comunes entre los dos objetos
  const propiedadesComunes = Object.keys(objetoBase)
    .filter(propiedad => nuevoObjeto.hasOwnProperty(propiedad));

  // Reemplazar las propiedades comunes
  propiedadesComunes.forEach(propiedad => {
    objetoBase[propiedad] = nuevoObjeto[propiedad];
  });

  // Devolver el objeto base actualizado
  return objetoBase;
}

