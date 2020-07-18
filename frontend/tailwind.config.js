module.exports = {
    purge: ["./feature/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./foundation/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
        },
        container: {
            padding: {
                default: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
            }
        },
        fontFamily: {
            display: ['Gilroy', 'sans-serif'],
            body: ['Graphik', 'sans-serif'],
        },
        borderWidth: {
            default: '1px',
            '0': '0',
            '2': '2px',
            '4': '4px',
        },
        extend: {
            colors: {
                cyan: '#9cdbff',
            },
            spacing: {
                '96': '24rem',
                '128': '32rem',
            }
        }
    },
    variants: {},
    plugins: [],
}