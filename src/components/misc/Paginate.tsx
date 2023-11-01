import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PaginateInterface } from "../../interfaces/ServerInterfaces";

interface PrivateProps {
  data?: PaginateInterface | null;
  action: Function;
}

export default function Paginate({ data, action }: PrivateProps) {
  //Initial Values
  const totalItems = data?.totalItems ?? 0;
  const lastPage = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 0;
  const offset = 35;

  //get page Array to map
  let pages: Array<number> = [];
  for (let index = 1; index <= lastPage; index++) {
    pages.push(index);
  }

  if (data && lastPage > 6) {
    //Create Window for pages view
    let btnWindow = 
      currentPage === 1 || currentPage === 2
      ? pages.slice(0,3)
      : currentPage === lastPage
      ? pages.slice(currentPage - 3, lastPage)
      : pages.slice(currentPage - 2, currentPage + 1)
 
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </a>
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </a>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando del{" "}
              <span className="font-medium">{currentPage * offset - (offset-1)}</span> al{" "}
              <span className="font-medium">
                {currentPage === lastPage ? totalItems : currentPage * offset}
              </span>{" "}
              de <span className="font-medium">{totalItems}</span> resultados
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {/*Before btn*/}
              <button
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() =>
                  currentPage > 1 && action && action(currentPage - 1, offset)
                }
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* First Page */}
              {currentPage > 2 && (
                <button
                  className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium ${
                    currentPage === 1 ? "text-white bg-slate-300" : ""
                  } focus:z-20`}
                  disabled={currentPage === 1}
                  onClick={() => action && action(1, offset)}
                >
                  1
                </button>
              )}

              {/* ... */}
              {currentPage > 3 && (
                <span className="relative z-10 inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
              )}

              {/* Button Window */}
              {btnWindow.map((page) => (
                <button
                  key={page}
                  className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium ${
                    currentPage === page ? "text-white bg-slate-300" : ""
                  } focus:z-20`}
                  disabled={currentPage === page}
                  onClick={() => action && action(page, offset)}
                >
                  {page}
                </button>
              ))}

              {/* ... */}
              {currentPage <= lastPage - 3 && (
                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
              )}

              {/*last Page */}
              {currentPage <= lastPage - 2 && (
                <button
                  className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium ${
                    currentPage === lastPage ? "text-white bg-slate-300" : ""
                  } focus:z-20`}
                  disabled={currentPage === lastPage}
                  onClick={() => action && action(lastPage, offset)}
                >
                  {lastPage}
                </button>
              )}

              {/*Next btn*/}
              <button
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() =>
                  currentPage < lastPage &&
                  action &&
                  action(currentPage + 1, offset)
                }
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() =>
              currentPage > 1 && action && action(currentPage - 1, offset)
            }
          >
            Previous
          </button>
          <button
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() =>
              currentPage < lastPage &&
              action &&
              action(currentPage + 1, offset)
            }
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando del{" "}
              <span className="font-medium">
                {totalItems !== 0 ? currentPage * offset - (offset - 1) : 0}
              </span>{" "}
              al{" "}
              <span className="font-medium">
                {totalItems === 0
                  ? 0
                  : currentPage === lastPage
                  ? totalItems
                  : currentPage * offset}
              </span>{" "}
              de <span className="font-medium">{totalItems}</span> resultados
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {/*Before btn*/}
              <button
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() =>
                  currentPage > 1 && action && action(currentPage - 1, offset)
                }
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {/*Pages btns*/}

              {pages.map((page) => (
                <button
                  key={page}
                  className={`relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium ${
                    page === currentPage ? "text-white bg-slate-300" : ""
                  } focus:z-20`}
                  disabled={currentPage === page}
                  onClick={() => action && action(page, offset)}
                >
                  {page}
                </button>
              ))}
              {/*Next btn*/}
              <button
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={() =>
                  currentPage < lastPage &&
                  action &&
                  action(currentPage + 1, offset)
                }
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
