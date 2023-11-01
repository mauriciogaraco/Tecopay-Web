import { BaseSyntheticEvent, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";


interface SearchProps {
  searchAction: (search:string|null)=>void;
  placeholder?:string
}

const SearchComponent = ({ searchAction, placeholder }: SearchProps) => {

  //Debounce for filter -----------------------------------------------------------------------------
  const [timeOutId, setTimeOutId] = useState<number | undefined>();
  const onKeyDown = () => {
    clearTimeout(timeOutId);
  };

  const onKeyUp = (e: BaseSyntheticEvent) => {
    const time = Number(
      setTimeout(() => {
        if (e.target.value !== "") {
          searchAction(e.target.value);
        } else {
          searchAction(null);
        }
      }, 900)
    );
    setTimeOutId(Number(time));
  };
  //----------------------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full bg-inherit">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <div className="relative flex text-gray-400">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id="search"
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-gray-500 focus:bg-opacity-100 focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
          placeholder={placeholder}
          type="search"
          name="search"
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
