import { useEffect} from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast } from "react-toastify";
import SpinnerLoading from "../SpinnerLoading";
import { useController, UseControllerProps } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/24/outline";
import ImageComponent from "./Image";
import useServer, { ImageLoad } from "../../../api/useServer";

interface MultiDropInterface {
  className?: string;
  previewDefault?: ImageLoad[];
  setDisabled?: Function;
}

const MultipleDrop = ({
  className,
  previewDefault,
  setDisabled,
  ...props
}: MultiDropInterface & UseControllerProps) => {
  const { imgPreview, uploadImg, updateImgLocal, isFetching } = useServer();
  const { field } = useController(props);
  const { getRootProps, open, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    maxSize: 200000,
    onDropRejected: (e: FileRejection[]) =>
      e[0].errors[0].code === "file-too-large"
        ? toast.error("La imagen excede los 200kb")
        : toast.error("Error al cargar la imagen"),
    onDropAccepted: async (file: File[]) => {
      const data = new FormData();
      file.map((img) => data.append(`file`, img));
      uploadImg(data, true); //true for multiple param
    },
    noKeyboard: false,
    multiple: true,
  });

  useEffect(() => {
    previewDefault && updateImgLocal(previewDefault);            
  }, []);

  useEffect(() => {
      field.onChange(imgPreview.map((item) => item.id));       
  }, [imgPreview]);

  const deleteImg = (idx:number) =>{
    const result = [...imgPreview];
    result.splice(idx, 1);
    updateImgLocal(result)
  }
  return (
    <div className={className}>
      {isFetching ? (
        <div className="flex items-center justify-center cursor-pointer h-full">
          <SpinnerLoading text="Subiendo imágenes, por favor espere ..." />
        </div>
      ) : (
        <div className="flex items-center justify-center cursor-pointer h-full">
          <div
            className="inline-flex items-center h-full gap-5"
            {...getRootProps({onTouchStart:open})}
          >
            <input hidden {...getInputProps()} />
            <svg
              className="object-center flex rounded-md text-gray-400 h-20"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col text-md text-gray-600 text-center flex-shrink-0 ">
              <div className="relative cursor-pointer rounded font-medium text-indigo-600 py-1   hover:text-indigo-500">
                <p className="text-left" >Click para agregar imágenes</p>
              </div>
              <p className="text-left">o arrastre en esta zona</p>
              {/* <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 200kB</p>*/}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 rounded-lg gap-3 p-5">
        {imgPreview.map((item, idx) => (
          <div key={idx} className="relative">
            <ImageComponent
              className="flex items-center rounded-md w-full h-full shadow-md"
              key={idx}
              src={item.src}
              hash={item.hash}
            />
            <TrashIcon className=" absolute top-2 right-2 h-8 p-1 text-red-800 border border-red-800 rounded-md bg-red-100 cursor-pointer active:shadow-md active:shadow-red-900" onClick={()=>deleteImg(idx)}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleDrop;
