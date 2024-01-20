import { useState } from "react";
import {
  type PaginateInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { toast } from "react-toastify";
import { generateUrlParams } from "../utils/helpers";


const useServerCategories = () => {
  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allCategories, setAllCategories] = useState<any>([])
  const [category, setCategory] = useState<any>([])

  //Postman -> all?

  //Postman -> register
  const addCategory = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoading(true)
    await query
    .post("/categories", data)
      .then((resp) => {
        allCategories([...allCategories, resp.data])
       toast.success("Categoria agregada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoading(false)
  };

  //Postman -> find by id
  const getCategory = async (issueEntityId: any) => {
    setIsLoading(true);
    await query
      .get(`/categories/${issueEntityId}`)
      .then((resp) => {
        setCategory(resp.data);
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

  const updateCategory = async (
    categoryID: number,
    dataCategory: any,
  ) => {
    setIsFetching(true);
    await query
      .patch(`/categories/${categoryID}`, dataCategory)
      .then(async (resp) => {
        setCategory(resp.data);
        toast.success("Actualización exitosa");
      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };

  return {
    allCategories,
    addCategory,
    getCategory,
    updateCategory,
    category,
  };
};
export default useServerCategories;
