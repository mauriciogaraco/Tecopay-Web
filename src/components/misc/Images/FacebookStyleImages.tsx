import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import MultipleDrop from "./MultipleDrop";
import {
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Button from "../Button";
import ImageComponent from "./Image";
import { ImageLoad } from "../../../api/useServer";
import Modal from "../GenericModal";

interface MultiInterface {
  submit: Function;
  className?: string;
  previewDefault?: ImageLoad[];
  setDisabled?: Function;
  fetching?: boolean;
}

const FacebookStyleImages = ({
  className,
  previewDefault,
  submit,
  fetching,
}: MultiInterface) => {
  const { handleSubmit, control } = useForm();
  const [imageModal, setImageModal] = useState(false);
  const quant = previewDefault?.length ?? 0;

  let component;

  switch (quant) {
    case 0:
      component = (
        <div className="flex flex-col items-center h-full w-full p-8">
          <svg
            className="object-center flex rounded-md text-gray-400 m-auto"
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
      );
      break;

    case 1:
      component = (
        <div className="flex flex-col items-center h-full w-full p-1">
          <ImageComponent
            src={previewDefault![0].src}
            hash={previewDefault![0].hash}
            className="object-scale-down h-full"
          />
        </div>
      );
      break;

    case 2:
      component = (
        <div className="grid grid-cols-2 items-center gap-1 h-full p-1">
          {previewDefault!.slice(0, 2).map((item, idx) => (
            <ImageComponent
              key={idx}
              src={item.src}
              hash={item.hash}
              className="object-scale-down h-full"
            />
          ))}
        </div>
      );
      break;

    case 3:
      component = (
        <div className="grid grid-rows-2 items-center justify center h-full gap-1">
          <div className="flex justify-center h-full">
            <ImageComponent
              src={previewDefault![0].src}
              hash={previewDefault![0].hash}
              className="object-scale-down h-full"
            />
          </div>
          {
            <div className="grid grid-cols-2 items-center gap-1 h-full">
              {previewDefault!.slice(1).map((item, idx) => (
                <ImageComponent
                  key={idx}
                  src={item.src}
                  hash={item.hash}
                  className="object-scale-down h-full"
                />
              ))}
            </div>
          }
        </div>
      );
      break;

    case 4:
      component = (
        <div className="grid grid-rows-2 gap-1 h-full">
          <div className="grid grid-cols-2 items-center gap-1">
            {previewDefault!.slice(0, 2).map((item, idx) => (
              <ImageComponent
                key={idx}
                src={item.src}
                hash={item.hash}
                className="object-scale-down h-full"
              />
            ))}
          </div>
          {
            <div className="grid grid-cols-2 items-center gap-1 h-full">
              {previewDefault!.slice(2, 4).map((item, idx) => (
                <ImageComponent
                  key={idx}
                  src={item.src}
                  hash={item.hash}
                  className="object-scale-down h-full"
                />
              ))}
            </div>
          }
        </div>
      );
      break;

    default:
      component = (
        <div className="flex flex-col gap-1 h-full">
          <div className="grid grid-cols-2 items-center gap-1 h-full">
            {previewDefault!.slice(0, 2).map((item, idx) => (
              <ImageComponent
                key={idx}
                src={item.src}
                hash={item.hash}
                className="object-scale-down h-full"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 items-center gap-1 h-full relative">
            {previewDefault!.slice(2, 5).map((item, idx) => (
              <ImageComponent
                key={idx}
                src={item.src}
                hash={item.hash}
                className="object-scale-down h-full"
              />
            ))}
            {quant > 5 && (
              <div className="absolute top-0 left-0 col-start-3 bg-gray-400 bg-opacity-50 h-full w-full flex justify-center items-center">
                <h5 className="text-2xl text-white font-bold ">{`+${
                  quant - 5
                }`}</h5>
              </div>
            )}
          </div>
        </div>
      );
      break;
  }

  const afterSubmit: SubmitHandler<Record<string, any>> = (data) => {
    submit(data, () => setImageModal(false));
  };

  return (
    <>
      <div className={`${className ? className : ""} relative group`}>
        {component}
        <div className="hidden group-hover:flex group-focus:flex flex-col absolute w-full h-full bg-gray-200 top-0 bg-opacity-70 p-1 items-center justify-center">
          <PhotoIcon className="text-gray-500 h-20" />
          <h1
            className="text-gray-500 font-semibold text-xl cursor-pointer underline"
            onClick={() => setImageModal(true)}
          >
            Configurar imágenes
          </h1>
        </div>
      </div>

      {imageModal && (
        <Modal state={imageModal} close={setImageModal} size="m">
          <form onSubmit={handleSubmit(afterSubmit)}>
            <MultipleDrop
              className="border border-gray-400 border-dashed p-2 rounded h-full"
              name="images"
              control={control}
              previewDefault={previewDefault}
            />
            <div className="flex justify-end py-2">
              <Button
                color="slate-600"
                type="submit"
                name="Actualizar"
                loading={fetching}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default FacebookStyleImages;
