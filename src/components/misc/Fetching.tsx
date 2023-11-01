/*
Config on tailwind.config.js/

extend:{
  keyframes:{
  logo:{
    '0%': {bottom:"-10px"},
    '50%' : {top:"0"}, 
    '100%': {bottom:"-10px", right:"-10px"},
  }
}

}
*/

interface Fetch{
  className?:string,
  text?:string
}

const Fetching = ({className,text}:Fetch) => {
  return (
    <div className={className ? className : "fixed z-50 h-full w-full bg-white bg-opacity-80 top-0 left-0 rounded-lg"}>
      <div
        className={`flex flex-col justify-center h-full items-center `}
      >
        <div className="relative h-12 w-12 grid grid-cols-2 grid-rows-2 gap-2 shadow-inner ">
          <div className="relative bg-black  text-white h-6 w-6"></div>
          <div className="bg-black text-white h-6 w-6"></div>
          <div className="bg-black  text-white h-6 w-6"></div>
          <div className="bg-orange-600 rounded-full h-6 w-6"></div>
          <div className="absolute w-7 h-7 bg-white opacity-40 animate-[fetch_1s_linear_infinite_normal]"></div>
        </div>
        {text && <p className="text-gray-800 pt-3">{text}</p>}
      </div>
    </div>
  );
};

export default Fetching;
