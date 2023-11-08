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
import { saveCards } from "../store/slices/cardsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";
import { SelectInterface } from "../interfaces/InterfacesLocal";

const useServerCards = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allCards, setAllCards] = useState<any>([]);
  const [card, setCard] = useState<AccountData | null>(null);
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);
  const [modalWaitingError, setModalWaitingError] = useState<string | null>(
    null
  );
  const [selectedDataToParent, setSelectedDataToParent] =
  useState<SelectInterface | null>(null);

  const [waiting, setWaiting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state)=> state.account.items)



  const getAllCards = async (filter: BasicType) => {
    setIsLoading(true);
    await query
      .get(`/card/all${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        console.log(resp.data)
        setAllCards(resp.data.items)
        console.log(resp.data.items)


      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };
  const addCard = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/card/create", data)
      .then((resp) => {
        
        console.log(resp.data.data)
        console.log(items)
        setAllCards([...items, resp.data.data])

        
        toast.success("Ticket agregado satisfactoriamente");
      }).then(()=>close())
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  const editCard = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .put(`/card/update/${id}`, data)
      .then((resp) => {
        console.log(selectedDataToParent)
        const newCards:any = [...allCards];
        const idx = newCards.findIndex((card:any) => card.id === id);
        const cardWithId = allCards.find((card:any) => card.id == id);
        const wholeData = Object.assign(data, {id, holder:{fullName:cardWithId.holder.fullName}, currency: {code: selectedDataToParent?.name}} )
        newCards.splice(idx, 1, wholeData);
        
        setAllCards(newCards)
        callback?.();
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };

  const getCard = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/card/findById/${id}`)
      .then((resp) => {
        setCard(resp.data);
        console.log(resp.data)
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };


  const deleteCard = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/card/delete/${id}`, {})
      .then(() => {
        toast.success("Tarjeta Eliminada con éxito");
        const newCard = allCards.filter((item:any) => item.id !== id);
        setAllCards(newCard)
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
    card,
    getAllCards,
    addCard,
    getCard,
    editCard,
    deleteCard,
    manageErrors,
    modalWaitingError,
    allCards,
    setAllCards,
    setSelectedDataToParent,
  };
};
export default useServerCards;
