import { useState, useRef } from "react";
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


  //registrar categorias como parte del proceso de crear nueva entidad
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
    close: Function
  ) => {
    setIsLoading(true)
    try {
      let addingEntity = await query.post("/entity", data);
      //extra code
      setAllEntity([addingEntity.data, ...allEntity]);
      toast.success("Entidad agregada satisfactoriamente");
      setIsLoading(false)
    } catch (error) {
      manageErrors(error);
    } finally {
      setIsFetching(false);
      close && close();
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
      //Update the object with the specific id of entity
      let updatedEntities = allEntity.map((obj: any) => (obj.id === entityID ? update.data : obj));

      //deleting categories
      await Promise.all(
        catToDelete.map(async (id: number) => {
          try {
            await deleteCategory(entityID, id);
            updatedEntities = updLocal(updatedEntities, 'del', { category: {}, id: entityID }, id);
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      //updating categories
      await Promise.all(
        dataCategory.map(async (obj: any) => {
          try {
            if (!obj.newCat && !obj.isBasic) {
              const resp = await updateCategory(entityID, obj.id, obj);
              updatedEntities = updLocal(updatedEntities, 'upd', { category: resp, id: entityID });
            }
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      //adding categories
      await Promise.all(
        dataCategory.map(async (obj: any) => {
          try {
            if (obj.newCat && !obj.isBasic) {
              const resp = await addCategory(entityID, obj);
              updatedEntities = updLocal(updatedEntities, 'add', { category: resp, id: entityID });
            }
          } catch (error) {
            manageErrors(error);
            return null;
          }
        })
      );
      setAllEntity(updatedEntities);
      toast.success("Entidad actualizada exitosamente");
      callback && callback();
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


  //Utility Functions________________________________________________________________________________
  const managePaginate = (opp: "add" | "del") => {
    if (paginate !== null) {
      if (opp === "add") {
        if (paginate.totalItems && paginate.totalPages && paginate.totalItems / paginate.totalPages < 35) {
          setPaginate({ ...paginate, totalItems: paginate.totalItems + 1 });
          return false;
        } else if (paginate.totalItems && paginate.totalPages) {
          setPaginate({
            ...paginate,
            totalItems: paginate.totalItems + 1,
            totalPages: Math.ceil(paginate.totalItems / 35),
          });
          return true;
        }
      } else {
        if (paginate.totalItems && paginate.totalPages && paginate.totalItems / paginate.totalPages <= 35) {
          setPaginate({ ...paginate, totalItems: paginate.totalItems - 1 });
          return false;
        } else if (paginate.totalItems && paginate.totalPages) {
          setPaginate({
            ...paginate,
            totalPages: Math.ceil(paginate.totalItems / 35),
            totalItems: paginate.totalItems - 1,
          });
          return true;
        }
      }
    }
  };

  const updLocal = (
    local_allEntity: any,
    opp: "del" | "add" | "upd",
    { category, id }: { category?: any; id?: number | null },
    catID?: number,
  ) => {
    let cat_upt;
    if (opp === "add") {
      cat_upt = local_allEntity.map((obj: any) => {
        if (obj.id === id) {
          return {
            ...obj,
            categories: [...obj.categories, category],
          };
        } else {
          return obj;
        }
      });
    } else if (opp === "upd") {
      cat_upt = local_allEntity.map((obj: any) => {
        if (obj.id === id) {
          const index = obj?.categories?.findIndex((cat: any) => cat.id === category.id);
          let updCat = [...obj.categories];
          updCat[index] = category;
          return {
            ...obj,
            categories: updCat,
          };
        } else {
          return obj;
        }
      });
    } else if (opp === "del") {
      cat_upt = local_allEntity.map((obj: any) => {
        if (obj.id === id) {
          const index = obj?.categories?.findIndex((cat: any) => cat.id === catID);
          let updCat = [...obj.categories];
          updCat.splice(index, 1);
          return {
            ...obj,
            categories: updCat,
          };
        } else {
          return obj;
        }
      });

    }
    return cat_upt;
  };
  //_________________________________________________________________________________Utility Functions

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