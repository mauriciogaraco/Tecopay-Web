import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppSelector } from "../store/hooks";
import {
  XMarkIcon,
  CreditCardIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  UserGroupIcon,
  TicketIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import useServer from "../api/useServer";
import NoAvatar from "./misc/NoAvatar";
import MyUserForm from "./business/MyUserForm";
import FormModal from "./modals/FormModal";
import LogoComponent from "./misc/LogoComponent";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

type Sidebar = {
  state: boolean;
  switchSidebar: Function;
};

export default function SideBar({ state, switchSidebar }: Sidebar) {
  const { logOut, modalWaiting, /*updateMyUser*/ } = useServer();
  const location = useLocation();
  const currentLocation = location.pathname.split("/")[1];
  const { user } = useAppSelector((state) => state.init);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: currentLocation === "",
    },

    {
      name: "cuentas",
      href: "cuentas",
      icon: UserCircleIcon,
      current: currentLocation === "cuentas",
    },
    /*{
      name: "Configuración",
      href: "configuration",
      icon: Cog6ToothIcon,
      current: currentLocation === "configuration",
    },*/
  ];

  {
    /**State of Edit Password Modal */
  }
  const [editModal, setEditModal] = useState(false);

  {
    /**Function to manage State of Edit Password Modal */
  }
  const switchEditModal = () => setEditModal(!editModal);

  return (
    <>
      {/* Sidebar for Moviles */}
      <Transition.Root show={state} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={() => switchSidebar(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-100 bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-300 shadow-[35px_0_60px_-15px_rgba(0,0,0,0.3)]">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
                      onClick={() => switchSidebar(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-gray-600"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-4">
                    <div className="h-7 w-7">
                      <LogoComponent />
                    </div>
                  </div>
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item: any) => (
                      <Link
                        to={item.href}
                        key={item.name}
                        className={classNames(
                          item.current
                            ? "bg-[#ea5e27] text-white"
                            : "text-gray-800 hover:bg-[#f69c78] hover:text-gray-200",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                        onClick={() => switchSidebar(false)}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-white"
                              : "text-gray-800 group-hover:text-gray-200",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-shrink-0 p-3 bg-gray-400">
                  <div
                    className="group block w-full flex-shrink-0"
                    onClick={() => {
                      switchEditModal();
                      switchSidebar(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div>
                        {user?.avatar?.src ? (
                          <img
                            className="inline-block h-9 w-9 rounded-full"
                            src={user.avatar.src}
                          />
                        ) : (
                          <div className="h-6 w-6 flex-shrink-0">
                            <NoAvatar />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-md font-medium text-white first-letter:uppercase">
                          {user?.displayName ?? user?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex bg-gray-400 p-2">
                  <div
                    className="flex gap-2 text-md font-medium text-white"
                    onClick={() => logOut()}
                  >
                    <ArrowRightOnRectangleIcon className="h-6" />
                    Cerrar Sesión
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col bg-gray-300 shadow-[5px_0_10px_rgba(0,0,0,0.3)]">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <div className="h-7 w-7">
                <LogoComponent />
              </div>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  to={item.href}
                  key={item.name}
                  className={classNames(
                    item.current
                      ? "bg-[#ea5e27] text-white"
                      : "text-gray-900 hover:bg-[#f69c78] hover:text-gray-100",
                    "group flex items-center px-2 py-2 text-md font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-white"
                        : "text-gray-00 group-hover:text-gray-8100",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-3 bg-gray-400">
            <button
              className="group block w-full flex-shrink-0"
              onClick={() => switchEditModal()}
            >
              <div className="flex items-center">
                <div>
                  {user?.avatar?.src ? (
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user.avatar.src}
                    />
                  ) : (
                    <div className="h-6 w-6 flex-shrink-0">
                      <NoAvatar />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-md font-medium text-white first-letter:uppercase">
                    {user?.displayName ?? user?.username}
                  </p>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-shrink-0 bg-gray-400 p-2">
            <button
              className="flex gap-2 text-md font-medium text-white"
              onClick={() => logOut()}
            >
              <ArrowRightOnRectangleIcon className="h-6" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {editModal && (
        <FormModal
          state={editModal}
          component={
            <MyUserForm
              closeModal={switchEditModal}
              action={()=>console.log('user')}
              isFetching={modalWaiting}
              initialValues={{
                displayName: user?.displayName,
                username: user?.username,
                id: user?.id,
              }}
            />
          }
        />
      )}
    </>
  );
}
