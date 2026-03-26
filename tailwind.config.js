/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                emerald: {
                    500: '#059669',
                    600: '#059669',
                    700: '#047857',
                },
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
                '5xl': '40px',
                '6xl': '60px',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'progress': 'progress 30s linear infinite',
            },
            keyframes: {
                progress: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                }
            }
        },
    },
    plugins: [
        require('tailwindcss-animate')
    ],
}
