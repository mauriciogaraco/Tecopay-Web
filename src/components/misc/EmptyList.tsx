import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

interface Empty{
  title?:string,
  subTitle?:string
}

const EmptyList = ({title,subTitle}:Empty) => {
  return (
    <div className="text-center">
      <FontAwesomeIcon
        icon={faBoxOpen}
        className="h-16 w-16 mt-3 text-gray-500 "
        aria-hidden="true"
      />
      <h3 className="mt-2 text-md font-medium text-gray-500">
        {title ?? "No hay elementos que mostrar"}
      </h3>
      {<p className="mt-1 text-sm text-gray-500">
        {subTitle ?? ""}
  </p>}
    </div>
  );
};

export default EmptyList;
