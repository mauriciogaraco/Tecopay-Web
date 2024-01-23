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


const useServerEntity = () => {


  const { manageErrors } = useServer();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [paginate, setPaginate] = useState<PaginateInterface | null>(null);
  const [entity, setEntity] = useState<Entidad | null>(null);
  const [allEntity, setAllEntity] = useState<any>([])
  const [business, setBusiness] = useState<any>([])
  const [categoriesEntities, setCategoriesEntities] = useState<any>([])


  //registrar categorias com parte del proceso de crear nueva entidad
  const {
    addCategory, updateCategory, getCategory, category, deleteCategory,
  } = userServerCategories();


  //Postman -> all?
  const getAllEntity = async (filter: BasicType) => {
    setIsFetching(true);
    await query
      .get(`/entity${generateUrlParams(filter)}`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });

        setAllEntity(resp.data.items)



      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };


  //Postman -> register
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
            addCategory(obj, () => { });
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
    }
    setIsFetching(false);
  };


  //Postman -> update
  const editEntity = async (
    id: number,
    data: Record<string, string | number | boolean | string[]>,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/entity/${id}`, data)
      .then((resp) => {
        const newUsers: any = [...allEntity];
        const dataWithId = Object.assign(data, { id: id })
        const idx = newUsers.findIndex((user: any) => user.id === id);
        newUsers.splice(idx, 1, dataWithId);
        setAllEntity(newUsers)
        //dispatch(saveEntity(newUsers))
        callback?.();
        toast.success("Entidad editada satisfactoriamente");
      })
      .catch((e) => { manageErrors(e); });
    setIsFetching(false);
  };


  //Postman -> find by id
  const getEntity = async (id: any) => {
    setIsLoading(true);
    await query
      .get(`/entity/${id}`)
      .then(async (resp) => {
        await setEntity(resp.data);
        return getCategory(resp?.data?.entity?.id)
      }).then(() => { setIsLoading(false) })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };


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
              addCategory(obj, () => { })
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
    }
    setIsFetching(false);
  };


  //Postman -> delete
  const deleteEntity = async (id: number, callback?: Function) => {
    await query
      .deleteAPI(`/entity/${id}`, {})
      .then((resp) => {
        callback && callback();
        toast.success("Entidad Eliminada con éxitosamente");
        //const newUsers = allEntity.filter((item: any) => item.id !== id);
        //setAllEntity(newUsers)
        //getAllEntity({});
      })
      .catch((error) => { manageErrors(error); });
  };


  //Postman -> setBusiness?
  const getAllBussinnes = async () => {
    setIsLoading(true);
    await query
      .get(`/business`)
      .then((resp) => {
        setPaginate({
          totalItems: resp.data.totalItems,
          totalPages: resp.data.totalPages,
          currentPage: resp.data.currentPage,
        });
        setBusiness(resp.data.items)
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
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
    editEntity,
    updateEntity,
    deleteEntity,
    manageErrors,
    setAllEntity
  };
};

export default useServerEntity;
