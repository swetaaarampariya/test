import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./../assets/scss/_forms.scss"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
// import { AuthProvider } from "@/context/AuthContext";
// import AuthLayout from "@/components/layout/AuthLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Choose weights as needed
  variable: "--font-poppins", // Custom CSS variable
});


export const metadata: Metadata = {
  title: "Gravitrain",
  description: "Generated by Glasier Inc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className="font-poppins"
      >
          {children}
        <ToastContainer position='top-right' theme='colored' autoClose={2000} />
      </body>
    </html>
  );
}
