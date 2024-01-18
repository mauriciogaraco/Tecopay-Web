import { useState } from "react";
import mediaQuery from "./APIMediaServer";
import { toast } from "react-toastify";

export interface ImageLoad {
  id: number;
  src: string;
  hash: string;
}

//Data
//"https://apidevpay.tecopos.com"
const baseUrl = `${process.env.REACT_APP_API_HOST_TICKET}`;

export const useServer = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [imgPreview, setImgPreview] = useState<ImageLoad[]>([]);
  const [imgView, setImgView] = useState<ImageLoad>();
  console.log('zxxxxxxxxxxxxxx')
  console.log(imgPreview)
  const manageErrors = (error: any) => {
    console.log(error);
    if (error.status === 401 || error.status === 403) {
      toast.error(error.response?.data?.message);
      return;
    }
    if (error.response?.data?.message) {
      toast.error(error.response?.data?.message);
      return;
    } else {
      toast.error(
        "Upss, ha ocurrido un error inesperado. \n Intente de nuevo o consulte con su administrador..."
      );
      return;
    }
  };

  const uploadImg = async (data: FormData, multiple: boolean = false) => {
    setIsFetching(true);
    await mediaQuery
      .post("/image", data)
      .then((resp) => {
        console.log(resp);
        if (multiple) {
          setImgPreview([
            ...imgPreview,
            ...resp.data.map((item: any) => ({
              id: item.id,
              src: `${baseUrl + resp.data.url}`,
              hash: item.blurHash,
            })),
          ]);
        } else {
          setImgPreview([
            {
              id: resp.data.id,
              src: `${baseUrl + resp.data.url}`,
              hash: resp.data.hash,
            },
          ]);
        }
      })
      .catch((e) => manageErrors(e));
    setIsFetching(false);
  };

  const getImg = async (id: any) => {
    setIsLoading(true);
    await mediaQuery
      .get(`/image/${id}`)
      .then((resp) => {
        setImgView(resp.data);
      })
      .catch((error) => { manageErrors(error); });
    setIsLoading(false);
  };

  const updateImgLocal = (data: ImageLoad[]) => {
    setImgPreview(data);
  };

  return {
    imgPreview,
    isLoading,
    isFetching,
    imgView,
    getImg,
    uploadImg,
    manageErrors,
    updateImgLocal,
  };
};

export default useServer;



