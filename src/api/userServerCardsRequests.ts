import { useState } from "react";
import {
  type PaginateInterface,
  type AccountData,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { Flip, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";
import { SelectInterface } from "../interfaces/InterfacesLocal";

const useServerCardsRequests = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allCardsRequests, setAllCardsRequests] = useState<any>([]);
  const [cardRequestRecords, setCardRequestRecords] = useState<any>([]);
  const [cardRequest, setCardRequest] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [selectedDataToParent, setSelectedDataToParent] =
  useState<SelectInterface | null>(null);

  const [waiting, setWaiting] = useState<boolean>(false);



  const getAllCardsRequests = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/cardRequest${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        console.log(resp.data)
        setAllCardsRequests(resp.data.items)
        console.log(resp.data.items)
        console.log(resp.data.totalItems)

      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

  const GetRequestRecord = async (id:number,  filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/cardRequest/${id}/record${generateUrlParams(filter)}`)
      .then((resp) => {
        console.log(resp.data)
        setCardRequestRecords(resp.data)
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  const addSimpleCardRequest = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/cardRequest/simple", data)
      .then((resp) => {
        
        console.log(resp.data)
        console.log(data)
        console.log(allCardsRequests)
        setAllCardsRequests([...allCardsRequests, resp.data])

        
        toast.success("Solicitud agregada satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  const addBulkCardRequest = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/cardRequest/bulk", data)
      .then((resp) => {
        
        console.log(resp.data)
        console.log(data)
        console.log(allCardsRequests)
        setAllCardsRequests([...allCardsRequests, resp.data])

        
        toast.success("Solicitudes agregadas satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  

  const editCardRequest = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/cardRequest/${id}`, data)
      .then((resp) => {
        const newCardsRequests:any = [...allCardsRequests];
        const idx = newCardsRequests.findIndex((card:any) => card.id === id);
        newCardsRequests.splice(idx, 1, resp.data);
        
        setAllCardsRequests(newCardsRequests)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getCardRequest = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/cardRequest/${id}`)
      .then((resp) => {
        setCardRequest(resp.data);
        console.log(resp.data)
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };


  const deleteCardRequest = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/cardRequest/${id}`, {})
      .then(() => {
        toast.success("Tarjeta Eliminada con éxito");
        const newCard = allCardsRequests.filter((item:any) => item.id !== id);
        setAllCardsRequests(newCard)
        callback?.();
      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };

  const acceptRequest = async (id: number, data: Record<string, string | number | boolean | string[]>, callback?: Function) => {
    setIsFetching(true);
    await query
      .post(`/cardRequest/accept`, data)
      .then(() => {
        toast.success("Tarjeta Aceptada con éxito");
        const newCard = allCardsRequests.filter((item:any) => item.id !== id);
        setAllCardsRequests(newCard)
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
    cardRequest,
    getAllCardsRequests,
    addSimpleCardRequest,
    getCardRequest,
    editCardRequest,
    deleteCardRequest,
    manageErrors,
    modalWaitingError,
    allCardsRequests,
    setAllCardsRequests,
    addBulkCardRequest,
    setSelectedDataToParent,
    acceptRequest,
    GetRequestRecord,
    cardRequestRecords
  };
};
export default useServerCardsRequests;
