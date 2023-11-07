/* @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/*.html'],
	theme: {
		extend: {
			colors: {
				'tecopay-900': '#03045E',
				'tecopay-800': '#033E8A',
				'tecopay-700': '#0078B6',
				'tecopay-600': '#0096C7',
				'tecopay-500': '#00B4D8',
				'tecopay-400': '#48CAE4',
				'tecopay-300': '#90E0EF',
				'tecopay-200': '#AEE8F4',
				'tecopay-100': '#CAF0F8',
			},
			keyframes: {
				logo: {
					'0%': { bottom: '-10px' },
					'50%': { top: '0' },
					'100%': { bottom: '-10px', right: '-10px' },
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		// require("tailwind-scrollbar-hide"),
		require('tailwind-scrollbar'),
	],
};
