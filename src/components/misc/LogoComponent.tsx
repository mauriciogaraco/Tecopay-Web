import { Cog8ToothIcon } from "@heroicons/react/20/solid";

interface LoadingProps{
    loading?:boolean
  }
  
  const CustomLoading = () => {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <div className="relative h-full w-full grid grid-cols-2 grid-rows-2 gap-[8%] shadow-inner">
          <div className="bg-black  text-white h-full w-full"></div>
          <div className="bg-black text-white h-full w-full"></div>
          <div className="bg-black  text-white h-full w-full"></div>
          <Cog8ToothIcon className="text-orange-600 h-full w-full"></Cog8ToothIcon>          
        </div>
      </div>
    );
  };
  
  export default CustomLoading;