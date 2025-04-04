import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { doLogout, getCurrentUserDetail } from "@/Auth";
import useWidth from "@/configs/common/useWidth";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowDown, MdMenu, MdOutlineNotificationsActive, MdSearch } from "react-icons/md";
import ConfirmationModal from "../common/ConfirmationModal";

type Props = {
  className?: string;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
};

type UserData = {
  id:number;
  firstName?: string;
  lastName?: string;
};

function Header({ className, isMobileOpen, setIsMobileOpen }: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  const { width, breakpoints } = useWidth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const profileRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.current && !(profileRef.current as HTMLElement).contains(event.target as Node)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    doLogout();
    setTimeout(() => {
      router.push('/admin/login');
    }, 100);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUserDetail();
      setUserData(userData);
    };

    fetchUser();
  }, []);

  return (
    <header className={className + " sticky top-0 z-10"}>
      <div className="flex bg-white h-[83.59px] w-full duration-300 items-center mb-4 px-6 transition-all">
        {width! < breakpoints.lg && (
          <div className="text-2xl cursor-pointer" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <MdMenu />
          </div>
        )}
        <div className="flex justify-between w-full items-center px-6 py-4">
          {/* Search Bar */}
          <div className="w-full hidden max-w-[400px] md:block relative cursor-wait">
            <input
              type="search"
              placeholder="Search..."
              className="bg-gray-100 border cursor-wait border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4 pr-10 py-2"
            />
            <MdSearch className="text-gray-500 absolute right-4 top-3" />
          </div>

          {/* Right Section (Notification + Profile) */}
          <div className="flex gap-6 items-center relative cursor-wait">
            {/* Notification Icon */}
            <div className="bg-gray-100 border border-gray-300 p-2 rounded-full relative">
              <MdOutlineNotificationsActive className="text-[#9BA6B7] text-2xl" />
              <span className="flex bg-[#37695F] h-[20.05px] justify-center rounded-full text-[13px] text-white w-[20.05px] -right-2 -top-2 absolute items-center">
                0
              </span>
            </div>

            {/* Vertical Line */}
            <div
              className="h-10 w-[2px]"
              style={{
                background: "linear-gradient(to top, #D6D8E11A, #D6D8E1, #D6D8E11A)",
              }}
            ></div>

            {/* Profile Info */}
            <div className="relative" ref={profileRef}>
              <div
                className="flex cursor-pointer items-center space-x-3"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {/* Profile Image */}
                <Image
                  src="/Image/logo.svg"
                  width={48.59}
                  height={48.59}
                  alt="User"
                  className="h-10 rounded-full w-10 object-cover"
                />
                {userData && (
                  <div>
                    <p className="text-[#1F2029] font-semibold">{userData.firstName}</p>
                    <p className="text-[#9BA6B7] text-sm">{userData.lastName}</p>
                  </div>
                )}

                {isProfileOpen ? (
                  <MdKeyboardArrowDown className="text-[#1F2029] duration-200 rotate-180 transition-transform" />
                ) : (
                  <MdKeyboardArrowDown className="text-[#1F2029] duration-200 transition-transform" />
                )}
              </div>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="bg-white border-transparent rounded-lg shadow-md w-40 absolute mt-2 right-0">
                  <ul className="py-2">
                    <li className="cursor-pointer hover:bg-gray-100 px-4 py-2" 
                     onClick={() => {
                      setIsProfileOpen(false);
                      router.push(`/profile/${userData?.id}`);
                    }}>Profile</li>

                    <li className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowModal(true);
                      }}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ConfirmationModal
          toggleModal={() => setShowModal(false)}
          onActive={() => {
            setShowModal(false);
            handleLogout();
            logout();
          }}
          confirmMsg="Are you sure you want to logout?"
        />
      )}
    </header>
  );
}

export default Header;
