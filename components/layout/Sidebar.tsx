"use client";
import Link from "next/link";
import Image from "next/image";
import SimpleBar from "simplebar-react";
import SidebarMenuItems from "./SidebarMenuItems";
import { TbMenu4 } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-[999] 
        ${isCollapsed ? "w-20" : "w-[260px]"}`}
      >
        <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="bg-black bg-opacity-50 fixed inset-0 md:hidden z-50" onClick={() => setIsMobileOpen(false)}></div>
      )}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 md:hidden
        ${isMobileOpen ? "w-[260px]" : "w-0 overflow-hidden"}`}
      >
        <SidebarContent isCollapsed={false} setIsCollapsed={() => {}} setIsMobileOpen={setIsMobileOpen} />
      </div>
    </>
  );
};

const SidebarContent: React.FC<{ isCollapsed: boolean; setIsCollapsed: (collapsed: boolean) => void; setIsMobileOpen?: (open: boolean) => void }> = ({
  isCollapsed,
  setIsCollapsed,
  setIsMobileOpen,
}) => (
  <div className="h-full relative">
    {/* Sidebar Header */}
    <div className="flex flex-col items-center py-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex justify-center">
        <Image
          className={`transition-all duration-300 ${isCollapsed ? "w-[40px] h-[40px]" : "w-[160px] h-[60px]"}`}
          alt="logo"
          src="/Image/logo.svg"
          width={isCollapsed ? 40 : 160}
          height={isCollapsed ? 40 : 60}
        />
      </Link>

      {/* Toggle Button */}
      {!setIsMobileOpen && 
      <div
        className="flex bg-white border-4 border-slate-100 h-[33.7px] justify-center rounded-full w-[33.7px] -right-4 absolute cursor-pointer items-center top-8"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <TbMenu4 className="text-[#4C4C5C]" size={22} />
      </div>
      }

      {/* Close Button for Mobile Sidebar */}
      {setIsMobileOpen && (
        <button className="absolute md:hidden right-4 top-4" onClick={() => setIsMobileOpen(false)}>
          <IoMdClose size={24} />
        </button>
      )}
    </div>

    {/* Sidebar Menu */}
    <SimpleBar className="h-[calc(100%-60px)] px-2 py-4">
      <ul>
        <SidebarMenuItems isCollapsed={isCollapsed} />
      </ul>
    </SimpleBar>
  </div>
);

export default Sidebar;
