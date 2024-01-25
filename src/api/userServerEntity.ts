import { useState } from "react";
import {
  type PaginateInterface,
} from "../interfaces/ServerInterfaces";
import query from "./APIServices";
import useServer from "./useServer";
import { toast } from "react-toastify";
import { generateUrlParams } from "../utils/helpers";
import { type BasicType } from "../interfaces/LocalInterfaces";
import userServerCategories from "./userServerCategories";


const useServerEntity = () => {

  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [entity, setEntity] = useState<Entidad | null>(null);
  const [allEntity, setAllEntity] = useState<any>([]);
  const [business, setBusiness] = useState<any>([]);


  //registrar categorias com parte del proceso de crear nueva entidad
  const { category, addCategory, updateCategory, getCategory, deleteCategory } = userServerCategories();


  //Postman -> 'entity / all'
  const getAllEntity = async (filter: BasicType) => {
    setIsFetching(true);
    try {
      let resp = await query.get(`/entity${generateUrlParams(filter)}`)
      setPaginate({
        totalItems: resp.data.totalItems,
        totalPages: resp.data.totalPages,
        currentPage: resp.data.currentPage,
      });
      setAllEntity(resp.data.items)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };


  //Postman -> 'entity / register'
  const addEntity = async (
    data: any,
    categories: any,
    close: Function
  ) => {
    setIsLoading(true)
    try {
      let addingEntity = await query.post("/entity", data)
      let issueEntityId = addingEntity.data.entity.id;
      const categoriesReady = categories.map((objeto: categoriesData) => ({
        ...objeto, issueEntityId,
      }));
      await Promise.all(
        categoriesReady.map(async (obj: any) => {
          try {
            addCategory(obj);
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      //extra code
      setAllEntity([addingEntity.data.entity, ...allEntity]);
      close && close();
      toast.success("Entidad agregada satisfactoriamente");
      setIsLoading(false)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };


  //Postman -> 'entity / find by id'
  const getEntity = async (id: number) => {
    setIsLoading(true);
    try {
      let entities = await query.get(`/entity/${id}`)
      setEntity(entities.data);
      await getCategory(entities?.data?.entity?.id)
      setIsLoading(false)
      return entities;
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };


  //Postman -> 'entity / update'
  const updateEntity = async (
    entityID: number,
    dataEntity: categoriesData[],
    dataCategory: any,
    catToDelete: number[],
    callback?: Function
  ) => {
    setIsFetching(true);
    try {
      let update = await query.patch(`/entity/${entityID}`, dataEntity)
      const newArray = allEntity.map((obj: any) => (obj.id === entityID ? update.data : obj));
      setAllEntity(newArray);
      await Promise.all(
        dataCategory.map(async (obj: any) => {
          try {
            if (obj.newCat) {
              obj.issueEntityId = entityID;
              addCategory(obj)
            } else {
              if (typeof obj.cardImageId === 'object' && obj.cardImageId !== null && 'id' in obj.cardImageId) {
                obj.cardImageId = obj.cardImageId.id;
              }
              updateCategory(obj.id, obj)
            }
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      await Promise.all(
        catToDelete.map(async (id: number) => {
          try {
            deleteCategory(id);
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      toast.success("Entidad actualizada exitosamente");
      callback && callback();
      //return(resultArray);

    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
    }
  };


  //Postman -> 'entity / delete'
  const deleteEntity = async (id: number, callback?: Function) => {
    try {
      callback && callback();
      await query.deleteAPI(`/entity/${id}`, {})
      setAllEntity(allEntity.filter((obj: any) => obj.id !== id))
      toast.success("Entidad eliminada exitosamente");
    } catch (error) {
      manageErrors(error);
    }
  };


  //Postman -> 'bussines / findAll'
  const getAllBussinnes = async () => {
    setIsLoading(true);
    try {
      let resp = await query.get(`/business`)
      setPaginate({
        totalItems: resp.data.totalItems,
        totalPages: resp.data.totalPages,
        currentPage: resp.data.currentPage,
      });
      setBusiness(resp.data.items)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    paginate,
    isLoading,
    isFetching,
    entity,
    business,
    allEntity,
    category,
    getAllBussinnes,
    getAllEntity,
    addEntity,
    getEntity,
    updateEntity,
    deleteEntity,
    manageErrors,
    setAllEntity,
  };
};

export default useServerEntity;





export type Entidad = {
  entity: Entity;
  profileImage: ProfileImage;
  category?: null;
}

type Entity = {
  id: number;
  name: string;
  address: string;
  phone: string;
  color: string;
  allowCreateAccount: boolean;
  profileImageId: number;
  owner: Owner;
  category: null;
}

type Owner = {
  fullName: string;
}

type ProfileImage = {
  id: number;
  url: string;
  hash: string;
}

type categoriesData = {
  name: string;
  color: `#${string}`;
  points?: number;
  id: number;
  issueEntityId: number;
  cardImageId?: number;
}