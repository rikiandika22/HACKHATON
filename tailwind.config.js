/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                primary: '#FF5A36',
                dark: '#1A1A1A',
                light: '#F8F9FA',
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'floating-1': 'floating 4s ease-in-out infinite',
                'floating-2': 'floatingReverse 5s ease-in-out infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                floating: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                floatingReverse: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(15px)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
