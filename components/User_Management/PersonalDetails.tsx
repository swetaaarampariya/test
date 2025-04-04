"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {  FaUser } from "react-icons/fa6";
import { useParams, usePathname } from "next/navigation";
import { AxiosGet } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { User } from "@/common/constants/type";

function PersonalDetails() {
  const { id } = useParams(); // Get ID from URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const userType = pathname.includes("trainer") ? "Trainer" : "Trainee";

  useEffect(() => {
      if (!id) return;
  
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await AxiosGet(`${API_URLS.USER.LIST}/profile/${id}`);
         
          if (response &&  typeof response !== 'string' && response.statusCode === 200) {
            setUser(response.data[0].user);
          }
        } catch (error) {
          console.log('error :>> ', error);
          setError("Error fetching user data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!user) return <p>No user found</p>;

  return (
    <div className="p-6 w-full mx-auto bg-white shadow rounded-lg">
      <div className="relative pb-4">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
          <div className="flex items-center gap-4">
          <div className="border-none rounded-full p-4 bg-background-primary text-textPrimary-150">
          <FaUser size={24} />
            </div>
            <h2 className="text-lg md:text-2x font-bold text-textPrimary-150">
            {userType} Profile Detail
            </h2>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#37695F1A] via-[#37695F] to-[#37695F1A]"></div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 mt-6">
        <div className="flex items-center gap-4">
          <Image
            src="/Image/logo.svg"
            alt="Profile Image"
            width={110}
            height={110}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
          />
          <div>
            <h2 className="text-sm md:text-[15px] font-bold text-textPrimary-150">
              {user.firstName}
            </h2>
            <p className=" text-xs md:text-[14px] text-textPrimary-250">
            {user.addresses?.length ?  `${user.addresses?.[0].address} ${user.addresses?.[0].city} ${user.addresses?.[0].state} ${user.addresses?.[0].country}`
            : " "  
            }
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="mt-12">
        {/* Personal Information */}
        <h3 className="text-lg font-semibold text-textPrimary-150 mb-8">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.firstName}
              disabled
            />
          </div>
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
             Last Name
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.lastName}
              disabled
            />
          </div>
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.email}
              disabled
            />
          </div>
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
              Mobile Number
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.phoneNumber}
            />
          </div>
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
            Password
            </label>
            <input
              type="password"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.password}
            />
          </div>
          <div>
            <label className="block text-textPrimary-150 text-sm mb-4">
            Gender
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.gender}
              disabled
            />
          </div>
        </div>

  
        {/* Specialization */}
        <h3 className="text-lg font-semibold text-textPrimary-150 mt-8 mb-8">
          Specialization
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4">
          <div >
            <label className="block text-textPrimary-150 text-sm mb-4">
            Interests
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={
                user?.interests?.length
                  ? user.interests.map((spec: any) => spec.interestName).join(", ")
                  : "-"
              } 
            />
          </div>
          <div >
            <label className="block text-textPrimary-150 text-sm mb-4">
            Activity
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={
                user?.activities?.length
                  ? user.activities.map((spec: any) => spec.activityName).join(", ")
                  : "-"
              } 
            />
          </div>
          <div >
            <label className="block text-textPrimary-150 text-sm mb-4">
            Weight
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user?.weight}
            />
          </div>
          <div >
            <label className="block text-textPrimary-150 text-sm mb-4">
            Height
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user?.height}
            />
          </div>
          <div className="col-span-4" >
            <label className="block text-textPrimary-150 text-sm mb-4">
             About
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.about}
              disabled
            />
          </div>
        </div>
      </div>

    

   
    </div>
  );
}

export default PersonalDetails;
