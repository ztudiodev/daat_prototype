/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/views/**/*.ejs", "./src/public/js/**/*.js"],
	theme: {
		extend: {
			boxShadow: {
				glow: "0 0 18px rgba(56, 189, 248, 0.18)",
			},
		},
	},
	plugins: [],
};
