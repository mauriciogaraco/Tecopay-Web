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


  //registrar categorias com parte del proceso de crear nueva entidad
  const {
    addCategory, updateCategory
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
    close && close();
    setIsLoading(true)
    await query
      .post("/entity", data)
      .then((resp) => {
        getAllEntity({});
        let issueEntityId = resp.data.entity.id;
        const categoriesReady = categories.map((objeto: categoriesData) => ({
          ...objeto, issueEntityId,
        }));
        categoriesReady.forEach(async (objeto: any) => {
          await addCategory(objeto, () => { });
        }).then(
          () => {
            toast.success("Entidad agregada satisfactoriamente");
            close && close();
          }
        )

      })
      .catch((e) => { manageErrors(e); });
    setIsLoading(false)
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
      .then((resp) => {
        setEntity(resp.data);
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

  const updateEntity = async (
    entityID: number,
    dataEntity: categoriesData[],
    dataCategory: any,
    callback?: Function
  ) => {
    setIsFetching(true);
    await query
      .patch(`/entity/${entityID}`, dataEntity)
      .then(async (resp) => {
        setEntity(resp.data);
        toast.success("Entidad actualizada exitosamente");
        callback && callback();
      })
      //.then(
      //  ()=>{
      //    const categoriesReady = dataCategory.map((objeto: categoriesData) => ({
      //      ...objeto, entityID,
      //    }));
      //    categoriesReady.forEach(async (objeto: any) => {
      //      await updateCategory(objeto, () => { });
      //    })
      //  }
      //)
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
  };

  //Postman -> delete
  const deleteEntity = async (id: number, callback?: Function) => {
    setIsFetching(true);
    await query
      .deleteAPI(`/entity/${id}`, {})
      .then(() => {
        toast.success("Entidad Eliminada con éxitosamente");
        //const newUsers = allEntity.filter((item: any) => item.id !== id);
        //setAllEntity(newUsers)
        getAllEntity({});
        callback && callback();
      })
      .catch((error) => { manageErrors(error); });
    setIsFetching(false);
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
