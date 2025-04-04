import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        tab: {
          50: '#DDDDDD'
        },
        title: '#2B3674',
         customGrey: 'rgba(76, 76, 92, 0.1)',
        breadCrumbs: {
          50: '#707EAE',
          100: '#6680db'
        },
        sidebar: {
          color: '#002678'
        },
        button: {
          50: '#172248',
          100: '#F0F1F7',
          200: '#A38818',
          300: '#0B0B0B',
          400: '#0087FF',
          green: '#9fcf5e'
        },
        border: {
          100:'#4C4C5C'
        },
        primary: {
          50: '#F6F8FF',
          100: '#EDF0FF',
          200: '#D1DAFE',
          300: '#B4C2FD',
          400: '#8092FF',
          500: '#4669fa',
          600: '#3F5EDF',
          700: '#0B3046',
          800: '#004A8C',
          900: '#0087FF'
        },
        secondary: {
          50: '#F9FAFB',
          100: '#F4F5F7',
          200: '#E5E7EB',
          300: '#D2D6DC',
          400: '#9FA6B2',
          500: '#A0AEC0',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        },
        textPrimary: {
          100: '#4F4F4F',
          200: '#333333',
          150:'#4C4C5C',
          250:'#929090',
          300:'#37695F',
          customGreen:'rgba(55, 105, 95, 1)',
          400:'rgba(76, 76, 92, 1)',
          primary: '#F0F4F7',
          green:'#37695F',
          grey :'#4C4C5C',
          subtitle:'#F0F4F7'
        },
        background: {
          primary: '#F0F4F7',
          green:'#37695F',
          grey :'#4C4C5C',
          subtitle:'#F0F4F7',
          btngreen:'#00D065',
          btnred:'#FF4537',
          

        },
        black: {
          50: '#F9FAFB',
          100: '#F4F5F7',
          200: '#E5E7EB',
          300: '#D2D6DC',
          400: '#9FA6B2',
          500: '#111112',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        },
        success: {
          50: '#F3FEF8',
          100: '#E7FDF1',
          200: '#C5FBE3',
          300: '#A3F9D5',
          400: '#5FF5B1',
          500: '#50C793',
          600: '#3F9A7A',
          700: '#2E6D61',
          800: '#1F4B47',
          900: '#0F2A2E'
        },
        gray: {
          50: '#A3AED099',
          200: '#838383',
          800: '#FAFAFA',
          900: '#A3AED0'
        },
        skyBlue: {
          50: '#32aee3'
        },
        borderColor:{
          50:'#4C4C5C1A'
        }
        
      },

      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      }
    }
  },
  plugins: []
};
export default config;
