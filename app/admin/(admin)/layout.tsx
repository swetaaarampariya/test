'use client';

import FullScreenLoader from "@/components/common/bigLoader";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import useWidth from "@/configs/common/useWidth";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password", '/admin/role', '/admin/sign-up'];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const { user } = useAuth();
    const { width, breakpoints } = useWidth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
  
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthenticated = !!user;
  
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }, []);

  return (
    <>
      {loading && (
       <FullScreenLoader />
      )}
      {isAuthenticated && !isPublicRoute &&
        <>
          <Header
            className={width! >= breakpoints.lg ? (isCollapsed ? 'ml-[72px]' : 'ml-[260px]') : ''}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
          {(width! >= breakpoints.lg || isMobileOpen) && (
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobileOpen={isMobileOpen}
              setIsMobileOpen={setIsMobileOpen}
            />)}
        </>
      }
      
      <div className="flex flex-col h-screen">
        <div
          className={`flex-grow overflow-y-auto ${isAuthenticated ? 'pb-[150px]' : 'pb-0'} ${isAuthenticated && !isPublicRoute && width! >= breakpoints.lg
              ? isCollapsed
                ? "ml-[72px]"
                : "ml-[250px]"
              : ""
            }`}
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <div className="bg-[#F1F5F9] min-h-full">{children}</div>
        </div>

        {isAuthenticated && !isPublicRoute && (
          <footer className="bg-[#fff] fixed bottom-0 left-0 w-full py-3 shadow-md h-[50px] flex items-center justify-center">
            <div className="container text-center">
              <p className="text-black-500 text-lg">
                © {new Date().getFullYear()} Gravitrain, All rights reserved.
              </p>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
