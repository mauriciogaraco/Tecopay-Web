/* Include under grid parent component*/

import React from "react";
import { Link } from "react-router-dom";

interface StatusCard {
  name: string;
  stat?: number;
  icon: React.ReactNode;
  href:string
}

const StausCard = ({ name, stat, icon,href }: StatusCard) => {
  return (
    <div
      key={name}
      className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
    >
      <dt>
        <div className="absolute rounded-md bg-orange-500 p-3">{icon}</div>
        <p className="ml-16 truncate text-sm md:text-md font-medium text-gray-500">
          {name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900 text-center">{stat}</p>
        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <Link
              to={href}
              className="flex justify-center font-medium text-orange-600 hover:text-orange-500"
            >
              Ver
              <span className="sr-only"> {name} stats</span>
            </Link>
          </div>
        </div>
      </dd>
    </div>
  );
};

export default StausCard;
