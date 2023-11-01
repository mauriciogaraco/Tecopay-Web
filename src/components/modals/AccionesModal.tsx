const AccionesModal = ({
  setAcciones,
  nuevoTicket,
  x,
  acciones,
  setNuevoTicket,
}: {
  x: JSX.Element;
  setNuevoTicket: (contactModal: boolean) => void;
  nuevoTicket: boolean;
  setAcciones: (contactModal: boolean) => void;
  acciones: boolean;
}) => {
  const ToggleContactModal = () => {
    setNuevoTicket(true);
    setAcciones(false);
  };
  return (
    <div className="lg:w-[250px] w-[200px] z-10 absolute flex flex-col alt-pop-enter enter top-0 right-10 2xl:right-0 shadow-lg opacity-95 h-[150px] lg:h-[200px] bg-gray-50 border p-4 rounded-lg border-black">
      <button
        className="w-4 h-4 relative bottom-2 left-2 self-end bg-red-700 rounded-full"
        onClick={() => setAcciones(false)}
      >
        {x}
      </button>

      <button
        onClick={ToggleContactModal}
        type="button"
        className="block rounded-lg px-3 py-2 w-full opacity-100 bg-orange-600  lg:px-3 lg:py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Nueva cuenta
      </button>
    </div>
  );
};

export default AccionesModal;
