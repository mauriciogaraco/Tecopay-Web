import { useState } from "react";
import {
  type PaginateInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServerMain";


const useServerCategories = () => {
  const { manageErrors, getImg } = useServer();
  const [isLoadingCat, setIsLoadingCat] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  //const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);


  //Postman -> 'categories / register'
  const addCategory = async (
    data: any
  ) => {
    setIsFetching(true);
    setIsLoadingCat(true)
    try {
      await query.post("/categories", data)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
      setIsLoadingCat(false)
    }
  };

  //Postman -> 'categories / find by id'
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
      return (resultArray);

    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoadingCat(false);
    }
  };

  //Postman -> 'categories / update'
  const updateCategory = async (
    categoryID: number,
    dataCategory: any,
  ) => {
    setIsFetching(true);
    try {
      let resp = await query.patch(`/categories/${categoryID}`, dataCategory)
      setCategory(resp.data);
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };

  //Postman -> 'categories / delete'
  const deleteCategory = async (
    categoryID: number
  ) => {
    try {
      await query.deleteAPI(`/categories/${categoryID}`, {});
    } catch (error) {
      manageErrors(error);
    }
  };


  return {
    allCategories,
    category,
    isLoadingCat,
    isFetching,
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    setCategory,
  };
};
export default useServerCategories;






interface FirstArrayObject {
  cardImageId: number | SecondArrayObject;
}

interface SecondArrayObject {
  id: number;
}

function integrateArrays(
  firstArray: FirstArrayObject[],
  secondArray: SecondArrayObject[]
): FirstArrayObject[] {
  // Create a copy of the first array to avoid modifying the original array
  const integratedArray: FirstArrayObject[] = [...firstArray];

  // Iterate over the second array
  secondArray.forEach((secondObj: any) => {
    // Find the corresponding object in the first array based on cardImageId and id
    const matchingObj = integratedArray.find(
      (firstObj: any) => firstObj.cardImageId === secondObj.id
    );

    // If a match is found, copy the entire object from the second array
    if (matchingObj) {
      matchingObj.cardImageId = { ...secondObj };
    }
  });

  return integratedArray;
}
