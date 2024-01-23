import { useState } from "react";
import {
  type PaginateInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
//import useServer from "./useServer";
import useServer from "./useServerMain";
import { toast } from "react-toastify";
import { generateUrlParams } from "../utils/helpers";


const useServerCategories = () => {
  const { manageErrors, getImg, imgView } = useServer();
  const [isLoadingCat, setIsLoadingCat] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);
  const [imgsFromArray, setImgsFromArray] = useState<any>([]);


  //Postman -> all?

  //Postman -> register
  const addCategory = async (
    data: any,
    close: Function
  ) => {
    setIsFetching(true);
    setIsLoadingCat(true)
    await query
      .post("/categories", data)
      .then((resp) => {
        //allCategories([...allCategories, resp.data])
        toast.success("Categoria agregada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
    setIsLoadingCat(false)
  };

  //Postman -> find by id
  //const getCategory = async (issueEntityId: any) => {
  //  setIsLoadingCat(true);
  //  await query
  //    .get(`/categories/${issueEntityId}`)
  //    .then(async (resp) => {
  //      setCategory(resp.data);
//
  //    })
  //    .catch((error) => { manageErrors(error); });
  //  setIsLoadingCat(false);
  //};
  const getCategory = async (issueEntityId: number) => {
    setIsLoadingCat(true);
    try {
      let categories = await query.get(`/categories/${issueEntityId}`)

      const imgsToRequest: number[] = categories.data
        .filter((obj: any) => typeof obj.cardImageId === 'number')
        .map((obj: any) => obj.cardImageId as number);

      const results = await Promise.all(
        imgsToRequest.map(async (id: number) => {
          try {
            return await getImg(id);
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      const resultArray: FirstArrayObject[] = integrateArrays(categories.data, results);
      setCategory(resultArray);
      setIsLoadingCat(false);
      return(resultArray);

    } catch (error) {
      manageErrors(error);
    }
    setIsLoadingCat(false);
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


  const deleteCategory = async (
    categoryID: number
  ) => {
    await query.deleteAPI(`/categories/${categoryID}`,{})
      .then(async (resp) => {
        toast.success("Categoria eliminada");
      })
      .catch((error) => { manageErrors(error); });
  };

  return {
    allCategories,
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    category,
    isLoadingCat,
    setCategory,
    imgsFromArray
  };
};
export default useServerCategories;






interface FirstArrayObject {
  cardImageId: number | SecondArrayObject;
  // Other properties of the object in the first array
}

interface SecondArrayObject {
  id: number;
  // Other properties of the object in the second array
}

function integrateArrays(
  firstArray: FirstArrayObject[],
  secondArray: SecondArrayObject[]
): FirstArrayObject[] {
  // Create a copy of the first array to avoid modifying the original array
  const integratedArray: FirstArrayObject[] = [...firstArray];

  // Iterate over the second array
  secondArray.forEach((secondObj:any) => {
    // Find the corresponding object in the first array based on cardImageId and id
    const matchingObj = integratedArray.find(
      (firstObj:any) => firstObj.cardImageId === secondObj.id
    );

    // If a match is found, copy the entire object from the second array
    if (matchingObj) {
      matchingObj.cardImageId = { ...secondObj };
    }
  });

  return integratedArray;
}
