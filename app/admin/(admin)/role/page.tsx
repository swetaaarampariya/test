"use client";

import { AxiosGet } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { Roles } from "@/common/constants/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Role: React.FC = () => {

  const [roles , setRoles]= useState<Roles[]>([]);

  const getRoleList = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.AUTH.ROLE}`);
  
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        setRoles(response.data)
      } 
    } catch (error) {
      console.error('Error fetching role list:', error);
      return null; // Handle error case
    }
  };

  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (selected === null) {
      toast.error("Please select a role before continuing!", {
        toastId: "no-role-selected",
        autoClose: 2000,
      });
      return;
    }
    
    try {
      const url = `/admin/sign-up?id=${encodeURIComponent(selected ?? "" )}`;
      router.push(url);
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', {
        toastId: 'nodata',
        autoClose: 1000
      });
    }
  };

  useEffect(() => {
    document.title = "Role"; 
    getRoleList()
  }, []);

  return (
    <div className="flex bg-[rgba(76, bg-background-primary h-screen justify-center 0.1)] 76, 92, items-center">
      <div className="bg-white border border-transparent h-auto p-6 rounded-lg w-full max-w-[90%] sm:p-8 sm:w-[621px]">
        <Image
          className="m-auto"
          alt="footer-logo"
          src="/Image/logo.svg"
          width="184"
          height="132"
        />
        <div className="bg-gradient-to-r h-[1px] w-full from-transparent my-6 to-transparent via-green-700"></div>

        <h2 className="text-2xl text-left text-textPrimary-150 font-medium mb-2 sm:text-3xl">
          Welcome to
          <span className="text-textPrimary-customGreen font-semibold">
            {" "}
            Gravitrain
          </span>
        </h2>
        <span className="text-sm text-textPrimary-250 font-normal sm:text-base">
          How Would You Like to Make a Difference?
        </span>
        <div className="my-6">
          <div className="flex flex-col space-y-4 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {roles && roles
            .filter((role) => role.displayName !== "Admin")
            .map((role) => (
              <div
                key={role.id}
                className={`flex items-center space-x-4 p-4 border-2 rounded-[10px] cursor-pointer transition-all duration-300 ${selected === role.id
                    ? "border-[#37695F] border-t-2"
                    : "border-customGrey"
                  }`}
                style={{ width: "100%", height: "auto", minHeight: "80px" }}
                onClick={() => setSelected(role.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex bg-[#F7F7F7] border-2 border-transparent h-10 justify-center rounded-full w-10 items-center sm:h-14 sm:w-14">
                    <div
                      className={`w-6 sm:w-[29px] h-6 sm:h-[29px] rounded-full transition-all duration-300 ${selected === role.id ? "bg-[#37695F]" : "bg-transparent"
                        }`}
                    ></div>
                  </div>
                  <label
                    htmlFor={role.displayName}
                    className="text-lg text-textPrimary-300 font-normal pl-5 sm:pl-7 sm:text-2xl"
                  >
                    {role.displayName}
                  </label>
                  <input
                    type="radio"
                    name="role"
                    className="hidden"
                    checked={selected === role.id}
                    onChange={() => setSelected(role.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={() => handleSubmit()}
              className="flex bg-background-green h-[50px] justify-center rounded-[5px] text-lg text-white w-full hover:bg-background-green items-center mt-10 py-2 sm:h-[55px] sm:text-xl sm:w-[276px]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
