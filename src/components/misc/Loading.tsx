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

interface LoadingProps {
	loading?: boolean;
}

const Loading = ({ loading = true }: LoadingProps) => {
	return (
		<div
			className={`flex ${
				loading ? 'h-screen' : 'h-full'
			} justify-center items-center`}
		>
			<div className='relative h-20 w-20 grid grid-cols-2 grid-rows-2 gap-3 shadow-inner'>
				<div className='bg-black  text-white h-10 w-10'></div>
				<div className='bg-black text-white h-10 w-10'></div>
				<div className='bg-black  text-white h-10 w-10'></div>
				<div className='bg-tecopay-600 rounded-full h-10 w-10'></div>
				<div className='absolute w-11 h-11 bg-white opacity-40 animate-[logo_1s_linear_infinite_normal]'></div>
			</div>
		</div>
	);
};

export default Loading;
