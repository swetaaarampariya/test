"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdDashboard, MdSettings } from "react-icons/md";
import { FaClone, FaUser } from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";
import { AxiosGet } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";

type SidebarMenuProps = {
  isCollapsed: boolean;
};

const SidebarMenuItems: React.FC<SidebarMenuProps> = ({ isCollapsed }) => {
  const location = usePathname();
  const router = useRouter(); // Use router for navigation
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard size={20} />, link: "/admin/dashboard" , permission: permissions?.dashboard?.VIEW, },
    {
      name: "Facility Manager",
      icon: <FaUser size={18} />,
      link: "/admin/facility_manager",
      permission: permissions?.facility_manager?.VIEW,
      subMenu: [
        { name: "Accept", link: "/admin/facility_manager/accept" ,  permission: permissions?.facility_manager?.subModule?.accept?.VIEW },
        { name: "Reject", link: "/admin/facility_manager/reject" , permission: permissions?.facility_manager?.subModule?.reject?.VIEW},
      ],
    },
    {
      name: "User Management",
      icon: <FaUser size={18} />,
      link: "/admin/user_management",
      permission: permissions?.user_management?.VIEW,
      subMenu: [
        // { name: "Users", link: "/user_management" },
        { name: "Trainee", link: "/admin/user_management/trainee" , permission : permissions?.user_management?.subModule?.trainee?.VIEW},
        { name: "Trainer", link: "/admin/user_management/trainer" ,permission : permissions?.user_management?.subModule?.trainer?.VIEW},
      ],
    },
    {
      name: "Master",
      icon: <FaClone size={18} />,
      permission: permissions?.master?.VIEW,
      subMenu: [
        { name: "Activity", link: "/admin/master/activity" ,permission : permissions?.master?.subModule?.activity?.VIEW},
        { name: "Interest", link: "/admin/master/interest" ,permission : permissions?.master?.subModule?.interest?.VIEW },
        { name: "Specialization", link: "/admin/master/specialization" , permission : permissions?.master?.subModule?.specialization?.VIEW },
      ],
    },
    {
      name: "Setting",
      icon: <MdSettings size={18} />,
      permission: permissions?.master?.VIEW,
      subMenu: [
        { name: "Roles and Permission", link: "/admin/settings/manage_role_permission" , permission: permissions?.settings?.subModule?.manage_role_permission
          ?.VIEW },
      ]
    }
  ];

  const fetchPermissions = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.AUTH.SIDEBAR_LIST}`);
      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        setLoading(false); 
        setPermissions(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
    finally {
      setLoading(false); 
    }
  };

  useEffect(()=>{
    fetchPermissions()
  },[])

  useEffect(() => {
    setActiveItem(location);
  }, [location]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu((prev) => (prev === name ? null : name));
  };

  const handleItemClick = (link?: string) => {
    if (link) {
      setActiveItem(link);
      router.push(link);
    }
  };

  if (loading) {
    return (
      <ul className="space-y-2">
        {Array(5).fill(null).map((_, index) => (
          <li key={index} className="animate-pulse bg-textPrimary-green h-10 rounded-lg"></li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {menuItems
      .filter((item) => item.permission)
      .map((item) => {
        const isMainActive =
          activeItem === item.link ||
          (item.subMenu && item.subMenu.some((sub) => sub.link === activeItem));

        return (
          <li key={item.name}
            className="relative rounded-lg"
          >
            <div
              className={`flex items-center justify-between px-2 py-3 rounded-lg cursor-pointer transition-all duration-300 ${isMainActive ? "bg-[#F0F4F7] text-textPrimary-green font-medium" : "text-[#4C4C5C]"
                }`}
              onClick={() => {
                if (item.subMenu && !isCollapsed) {
                  toggleSubMenu(item.name);
                }
                if (item.link) {
                  handleItemClick(item.link);
                }
              }}
            >
              <div
                className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-1"
                  }`}
              >
                <span className="flex justify-center items-center w-8 h-8">
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-base">{item.name}</span>}
              </div>
              {!isCollapsed && item.subMenu && (
                <span
                  className={`transition-transform duration-500 ${openSubMenu === item.name ? "rotate-90" : "rotate-0"
                    }`}
                >
                  <IoChevronForward size={16} />
                </span>
              )}
            </div>

            {!isCollapsed && item.subMenu && openSubMenu === item.name && (
              <ul className="pl-6 mt-2 space-y-1">
                {item.subMenu.map((subItem) => (
                  <li key={subItem.link}>
                    <Link
                      href={subItem.link}
                      className={`flex ml-4 mt-4 items-center gap-2 transition-all duration-300 ${activeItem === subItem.link ? "text-textPrimary-green font-medium" : "text-gray-600 "
                        }`}
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span>{subItem.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  );
};

export default SidebarMenuItems;
