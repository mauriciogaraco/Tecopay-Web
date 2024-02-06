import { useEffect } from "react";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { toast } from "react-toastify";
import useServer from "../../../api/useServerMain";
import SpinnerLoading from "../SpinnerLoading";
import { useController, UseControllerProps } from "react-hook-form";
import ImageComponent from "./Image";

interface DropInterface {
  className?: string;
  previewDefault?: string;
  previewHash?: string;
  setDisabled?: Function;
  text?:string;
  setData?: Function;
  dataUp?:Function;
  dataIndex?:string;
}

const GenericImageDrop = ({
  className,
  previewDefault,
  previewHash,
  setDisabled,
  text,
  dataUp,
  dataIndex,
  ...props
}: DropInterface & UseControllerProps) => {
  const { imgPreview, uploadImg, isFetching } = useServer();
  const { field } = useController(props);
 
  useEffect(() => {
		if (dataIndex && dataUp && Array.isArray(imgPreview) && imgPreview.length > 0 && imgPreview[0]?.id) {
      dataUp( (c:any) => {
        const c_copy = [...c];
        const check = c.find((obj:any) => obj.hasOwnProperty(dataIndex));
        if (check) {
          check[dataIndex] = imgPreview[0];
        } else {
          const newObject = { [dataIndex]: imgPreview[0] };
          c_copy.push(newObject);
        }
        return c_copy; 
      });
    }
	}, [imgPreview]);


  useEffect(() => {
    imgPreview.length !== 0 && field.onChange(imgPreview[0].id);
  }, [imgPreview]);

  const { getRootProps, open } = useDropzone({
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    //maxSize: 200000,
    onDropRejected: (e: FileRejection[]) =>
      e[0].errors[0].code === "file-too-large"
        ? toast.error("La imagen excede los 200kb")
        : toast.error("Error al cargar la imagen"),
    onDropAccepted: async (file: File[], e: DropEvent) => {
      const data = new FormData();
      data.append("file", file[0]);
      uploadImg(data)
    },
    noKeyboard: false,
    multiple: false,
  });
  if (isFetching)
    return (
      <div
        className={
          className
            ? className
            : "flex items-center justify-center border border-gray-300 p-2 rounded cursor-pointer h-full"
        }
      >
        <SpinnerLoading />
      </div>
    );

  return (
    <div
      className={`${
        className
          ? className
          : "flex items-center justify-center border border-gray-300 p-2 rounded cursor-pointer h-full overflow-hidden"
      } relative group`}
      {...getRootProps()}
    >
      {imgPreview.length !== 0 || previewDefault ? (
        <div className="absolute -z-10 h-full w-full top-0 left-0">
          <ImageComponent
            className="flex h-full w-full justify-center items-center"
            src={imgPreview[0]?.src ?? previewDefault}
            hash={imgPreview[0]?.hash ?? previewHash}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full p-5">
          <svg
            className="h-full rounded-md text-gray-400 m-auto"
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
        </div>
      )}
      <div
        className={`${
          className ? className : ""
        } hidden group-hover:flex justify-center absolute top-0 items-center bg-gray-500 opacity-75 w-full h-full`}
      >
        <div className="flex flex-col text-sm text-gray-600 text-center items-center p-5">
          <div className="relative cursor-pointer rounded font-medium text-gray-50">
            <p onTouchStartCapture={open}>{text ? text : 'Arrastre archivo'}</p>
          </div>
         {/*<p className="text-gray-100">{text ? '' : 'o arrastre uno'}</p>*/}
          {/* <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 200kB</p>*/}
        </div>
      </div>
    </div>
  );
};

export default GenericImageDrop;
