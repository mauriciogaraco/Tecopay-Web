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
  const [cardRequest, setCardRequest] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [selectedDataToParent, setSelectedDataToParent] =
  useState<SelectInterface | null>(null);

  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.account.items)



  const getAllCardsRequests = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/request/all${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        console.log(resp.data)
        setAllCardsRequests(resp.data.items)
        console.log(resp.data.items)


      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  const addCardRequest = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/request/create", data)
      .then((resp) => {
        
        console.log(resp.data.data)
        console.log(items)
        setAllCardsRequests([...items, resp.data.data])

        
        toast.success("Ticket agregado satisfactoriamente");
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
      .put(`/request/update/${id}`, data)
      .then((resp) => {
        console.log(selectedDataToParent)
        const newCardsRequests:any = [...allCardsRequests];
        const idx = newCardsRequests.findIndex((card:any) => card.id === id);
        const cardWithId = allCardsRequests.find((card:any) => card.id == id);
        const wholeData = Object.assign(data, {id, issueEntity:{name:cardWithId.issueEntity.name}, card: {currency: cardWithId?.card.currency.code}, user: {currency: cardWithId?.user.fullName}} )
        newCardsRequests.splice(idx, 1, wholeData);
        
        setAllCardsRequests(newCardsRequests)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getCardRequest = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/request/findById/${id}`)
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
      .deleteAPI(`/request/delete/${id}`, {})
      .then(() => {
        toast.success("Tarjeta Eliminada con éxito");
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
    addCardRequest,
    getCardRequest,
    editCardRequest,
    deleteCardRequest,
    manageErrors,
    modalWaitingError,
    allCardsRequests,
    setAllCardsRequests,
    setSelectedDataToParent,
  };
};
export default useServerCardsRequests;
