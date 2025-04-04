"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCheck, FaUser } from "react-icons/fa6";
import { IoImagesOutline } from "react-icons/io5";
import { MdDriveFolderUpload } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "next/navigation";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import RejectionModel from "@/components/common/RejectionModel";
import { AxiosGet, AxiosPatch } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  address: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  specializations: [];
  activities: [];
  country: string;
  about: string;
  rejectionReason:string;
  isFacilityManagerApproved: boolean;
  addresses: Address[];
}

function Page() {
  const { id } = useParams(); // Get ID from URL
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showRejectionModel, setShowRejectionModel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [certificateList, setCertificateList] = useState([])
  const [filePath, setFilePath] = useState('')

  const router = useRouter();

  const handleAcceptClick = () => {
    setShowConfirmationModal(true);
  };

  const handelAcceptUser = async () => {
    try {
      const payload = {
        isApprove: true,
        id: user?.id,
      }
      const response = await AxiosPatch(`${API_URLS.USER.STATUS_UPDATE}`, payload);

      if (response && typeof response !== 'string' && response.statusCode === 200) {
        toast.success(response?.message || "status updated successfully.", { autoClose: 2000 });
        setShowConfirmationModal(false);
        setTimeout(() => {
          router.push("/facility_manager/accept");
        }, 2000);
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', {
        autoClose: 1000
      });
    }
  };

  const handelRejectUser = async (reason: string) => {
    try {
      const payload = {
        isApprove: false,
        id: user?.id,
        rejectionReason: reason,
      };

      const response = await AxiosPatch(`${API_URLS.USER.STATUS_UPDATE}`, payload);

      if (response && typeof response !== 'string' && response.statusCode === 200) {
        toast.success(response?.message || "status updated successfully.", { autoClose: 2000 });
        setShowRejectionModel(false);
        setTimeout(() => {
          router.push("/facility_manager/reject");
        }, 2000);
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', {
        autoClose: 1000
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await AxiosGet(`${API_URLS.USER.LIST}/profile/${id}`);

        if (response && typeof response !== 'string' && response.statusCode === 200) {
          console.log("data", response.data[0].user)
          setUser(response.data[0].user);
          setCertificateList(response.data[0].user.certificates ?? [])
          setFilePath(response?.filePath ?? '')
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

  const toggleRejectionModal = () => setShowRejectionModel((prev) => !prev);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user found</p>;

  return (
    <div className="bg-slate-100 space-y-6 p-6">
      <div className="p-6 w-full mx-auto bg-white shadow rounded-lg">
        {showConfirmationModal && <ConfirmationModal
          toggleModal={() => setShowConfirmationModal(false)}
          onActive={handelAcceptUser} // Calls API when confirmed
          confirmMsg="Are you sure you want to approve this user?"
        />}

        {showRejectionModel && <RejectionModel toggleModal={toggleRejectionModal} onActive={handelRejectUser} />}

        {/* Header Section */}
        <div className="relative pb-4">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="border-none rounded-full p-4 bg-background-primary text-textPrimary-150">
                <FaUser size={24} />
              </div>
              <h2 className="text-lg md:text-2x font-bold text-textPrimary-150">
                Facility Manager Profile Detail
              </h2>
            </div>

            {user?.isFacilityManagerApproved === null ? (
              <div className="flex gap-2 md:gap-4 text-sm md:text-base mt-4 md:mt-0">
                <button
                  className="bg-green-500 w-[132px] text-white px-4 py-2 rounded flex items-center justify-center gap-1 shadow hover:bg-green-600"
                  onClick={() => handleAcceptClick()}
                >
                  Accept <FaCheck />
                </button>
                <button
                  className="bg-red-500 w-[132px] text-white px-4 py-2 rounded flex items-center justify-center gap-1 shadow hover:bg-red-600"
                  onClick={() => toggleRejectionModal()}
                >
                  Reject <FaTimes />
                </button>
              </div>
            ) : null}

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
              <h2 className="text-sm md:text-[15px] font-bold text-textPrimary-150 capitalize">
                {`${user.firstName}  ${user.lastName}`}

                {/*Accept and Reject */}
                {user?.isFacilityManagerApproved === false ? (
                  <span className="text-red-600 font-semibold"> ( Reject User )</span>
                ) : user?.isFacilityManagerApproved === true ? (
                  <span className="text-green-600 font-semibold"> ( Accept User )</span>
                ) : null}

              </h2>
              <p className=" text-xs md:text-[14px] text-textPrimary-250">
                {user.addresses?.length ? `${user.addresses?.[0].address} ${user.addresses?.[0].city} ${user.addresses?.[0].state} ${user.addresses?.[0].country}`
                  : " "
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-semibold text-textPrimary-150 mb-8">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-textPrimary-150 text-sm mb-4">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-borderColor-50 rounded p-2 bg-white capitalize"
                defaultValue={`${user.firstName}  ${user.lastName}`}
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
                disabled
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-textPrimary-150 mt-8 mb-8">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-textPrimary-150 text-sm mb-4">
                Full Address *
              </label>
              <input
                type="text"
                className="w-full border border-borderColor-50 rounded p-2 bg-white"
                defaultValue={
                  user.addresses?.[0] ?
                    ` ${user.addresses?.[0].address} ${user.addresses?.[0].city} ${user.addresses?.[0].state} ${user.addresses?.[0].country} `
                    : ''
                }
                disabled
              />
            </div>
            <div className="col-span-1">
              <label className="block text-textPrimary-150 text-sm mb-4">
                City *
              </label>
              <input
                type="text"
                className="w-full border border-borderColor-50 rounded p-2 bg-white"
                defaultValue={user.addresses?.[0]?.city || ''}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-1">
              <label className="block text-textPrimary-150 text-sm mb-4">
                State
              </label>
              <select className="w-full border border-borderColor-50 rounded p-2 bg-white">
                <option>{user.addresses?.[0]?.state || ''}</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-textPrimary-150 text-sm mb-4">
                Country
              </label>
              <select className="w-full border border-borderColor-50 rounded p-2 bg-white">
                <option>{user.addresses?.[0]?.country || ''}</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-textPrimary-150 mt-8 mb-8">
            Specialization
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-textPrimary-150 text-sm mb-4">
                Specialization
              </label>
              <input
                type="text"
                className="w-full border border-borderColor-50 rounded p-2 bg-white"
                defaultValue={
                  user?.specializations?.length
                    ? user.specializations.map((spec: any) => spec.specializationName).join(", ")
                    : "-"
                }                
                disabled
              />
            </div>
            <div className="col-span-1">
              <label className="block text-textPrimary-150 text-sm mb-4">
                Activities
              </label>
              <input
                type="text"
                className="w-full border border-borderColor-50 rounded p-2 bg-white"
                defaultValue={
                  user?.activities?.length
                    ? user.activities.map((spec: any) => spec.activityName).join(", ")
                    : "-"
                }                
                disabled
              />
            </div>
            <div className="col-span-1">
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

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-textPrimary-150 mb-8">
            Certificates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Drag & Drop File Upload */}
            <div className="md:col-span-4 border-none bg-[#ECEDF2] p-6 rounded-lg flex flex-col items-center text-gray-500 w-full">
              <div className="border-dashed border-2 border-[#5799D9] bg-white w-full h-[150px] flex flex-col justify-center items-center rounded-lg mb-4">
                <MdDriveFolderUpload
                  size={50}
                  className="text-textPrimary-300 mb-2"
                />
                <p className="text-sm text-center capitalize">
                  Drop your file(s) here, or{" "}
                  <span className="text-blue-500 cursor-pointer">Browse</span>
                </p>
              </div>

              <div className="w-full space-y-3">
                {[
                  { name: "Passport.jpg", progress: 92 },
                  { name: "Profile.png", progress: 60 },
                  { name: "file type.jpg", progress: 80 },
                ].map((file, index) => (
                  <div key={index} className="p-1 w-full">
                    <div className="flex items-center gap-3">
                      <IoImagesOutline className="text-[#1A3659] text-5xl" />
                      <div className="w-full bg-gray-300 h-2 rounded-md relative">
                        <div className="absolute left-0 bottom-2">
                          <span className="text-[#112136] text-sm block mb-1">
                            {file.name}
                          </span>
                        </div>
                        <div
                          className="bg-textPrimary-green h-2 rounded-md absolute left-0 top-0"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {file.progress}%
                      </span>
                      <div className="cursor-pointer border rounded-full bg-white p-1">
                        <RxCross1 />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block md:col-span-1 h-full w-[2px] bg-gradient-to-t from-[#37695F1A] via-[#37695F] to-[#37695F1A] mx-auto"></div>
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificateList && certificateList.length > 0 ? (
                  certificateList.map((doc, index) => (
                    <div key={index} className="bg-white p-6 flex items-center gap-4">
                      <span className="text-[#A4A4A4] text-3xl">
                        <Image
                          src="/Image/Certificate.svg"
                          alt="certificate"
                          width={43}
                          height={55}
                        />
                      </span>
                      <a
                        href={`${filePath}/${doc}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-[#4C4C5C] hover:underline"
                      >
                        Certificate {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <span>No Certificates Found</span>
                )}

              </div>
            </div>
          </div>
        </div>

        {user?.isFacilityManagerApproved === false &&
          <div className="col-span-2 ">
            <p className="mt-6 text-textPrimary-150 text-lg font-semibold">Reject Reason</p>
            <label className="block text-textPrimary-150 text-[15px] mb-2 mt-4">
              Reason
            </label>
            <input
              type="text"
              className="w-full border border-borderColor-50 rounded p-2 bg-white"
              defaultValue={user.rejectionReason}
              disabled
            />
          </div>
        }

        {user?.isFacilityManagerApproved === null && <div className="flex gap-4 text-base justify-center mt-10 mb-10">
          <button className="bg-green-500 w-[132px] text-white px-4 py-2 rounded flex items-center justify-center gap-1 shadow hover:bg-green-600"
            onClick={() => handleAcceptClick()}
          >
            Accept <FaCheck />
          </button>
          <button className="bg-red-500 w-[132px] text-white px-4 py-2 rounded flex items-center justify-center gap-1 shadow hover:bg-red-600"
            onClick={() => toggleRejectionModal()}
          >
            Reject <FaTimes />
          </button>
        </div>
        }
      </div>
    </div>
  );
}

export default Page;
