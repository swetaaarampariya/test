"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { Formik, Form, Field } from "formik";
import Select, { MultiValue } from "react-select";
import { useParams, useRouter } from "next/navigation";
import { AxiosGet, AxiosPut } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import {
  ActivityList,
  CityList,
  CountryList,
  CountryOption,
  SelectOption,
  SpecializationList,
  StateList,
} from "@/common/constants/interface";
import { toast } from "react-toastify";
import CertificateUploader from "@/components/profile/certificateUploader";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  specialization: [];
  country: string;
  about: string;
  addresses: any;
  activityIds: [];
  pinCode: string;
  specializations: any;
  activities: any;
}

function Profile() {
  const { id } = useParams(); // Get ID from URL
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countryList, setCountryList] = useState<CountryList[]>([]);
  const [stateList, setStateList] = useState<StateList[]>([]);
  const [cityList, setCityList] = useState<CityList[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  );
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [specializationList, setSpecializationList] = useState<
    SpecializationList[]
  >([]);
  const [activityList, setActivityList] = useState<ActivityList[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<any>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>([]);
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [documentList, setDocumentList] = useState();
  const [filePath, setFilePath] = useState("");

  const getCountryList = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.ADDRESS.COUNTRY}`);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        const countryData = response.data;

        setCountryList(countryData);

        const matchingCountry = countryData.find(
          (item: any) => item.isoCode === user?.addresses?.[0]?.country
        );
        if (matchingCountry) {
          setSelectedCountry({
            value: matchingCountry.isoCode,
            label: matchingCountry.name,
          });
          await getStateList(matchingCountry.isoCode);
        }
      }
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const getStateList = async (countryCode: number | string) => {
    try {
      const response = await AxiosGet(
        `${API_URLS.ADDRESS.STATE}/${countryCode}`
      );

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        const stateData = response.data;
        setStateList(stateData);

        const matchingState = stateData.find(
          (item: any) => item.isoCode === user?.addresses?.[0]?.state
        );
        if (matchingState) {
          setSelectedState({
            value: matchingState.isoCode,
            label: matchingState.name,
          });
          await getCityList(matchingState.isoCode);
        }
      }
    } catch (error) {
      console.error("Error fetching state list:", error);
    }
  };

  const getCityList = async (stateCode: string | number) => {
    try {
      const response = await AxiosGet(
        `${API_URLS.ADDRESS.CITY}/${selectedCountry?.value}/${stateCode}`
      );

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        const cityData = response.data;
        setCityList(cityData);

        const matchingCity = cityData.find(
          (item: any) => item.name === user?.addresses?.[0]?.city
        );
        if (matchingCity) {
          setSelectedCity({
            value: matchingCity.stateCode,
            label: matchingCity.name,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching city list:", error);
    }
  };
  useEffect(() => {
    getCountryList();
    getSpecializationList();
    getActivityList();
  }, [user]);
  useEffect(() => {
    if (selectedCountry?.value) {
      getStateList(selectedCountry.value);
    }
  }, [selectedCountry]);

  // Trigger city list fetch when selectedState is set
  useEffect(() => {
    if (selectedState?.value) {
      getCityList(selectedState.value);
    }
  }, [selectedState]);
  const getSpecializationList = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.AUTH.SPECIALIZATION}`);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        const matchingSpecializations = response.data
          .filter((item: any) =>
            user?.specializations?.some(
              (userSpec: any) =>
                userSpec.specializationName === item.specializationName
            )
          )
          .map((item: any) => ({
            value: item.id,
            label: item.specializationName,
          }));

        // Set selected specializations
        setSelectedSpecialization(matchingSpecializations);
        setSpecializationList(response.data);
      }
    } catch (error) {
      console.error("Error fetching role list:", error);
      return null; // Handle error case
    }
  };

  const getActivityList = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.ACTIVITY.LIST}`);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        const matchingActivities = response.data
          .filter((item: any) =>
            user?.activities?.some(
              (userActivity: any) =>
                userActivity.activityName === item.activityName
            )
          )
          .map((item: any) => ({ value: item.id, label: item.activityName }));

        // Set selected activities
        setSelectedActivity(matchingActivities);
        setActivityList(response.data);
      }
    } catch (error) {
      console.error("Error fetching role list:", error);
      return null; // Handle error case
    }
  };

  const handleCountryChange = (selectedOption: SelectOption | null) => {
    if (!selectedOption) return;
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    getStateList(selectedOption.value.toString());
  };

  const handleStateChange = (selectedOption: SelectOption | null) => {
    if (!selectedOption) return;
    setSelectedState(selectedOption);
    setSelectedCity(null);
    getCityList(selectedOption.value.toString());
  };

  const handleCityChange = (selectedOption: SelectOption | null) => {
    if (!selectedOption) return;
    setSelectedCity(selectedOption);
    getCityList(selectedOption.value.toString());
  };
  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await AxiosGet(`${API_URLS.AUTH.USER_PROFILE}/${id}`);

        if (
          response &&
          typeof response !== "string" &&
          response.statusCode === 200
        ) {
          setUser(response.data[0].user);
          setDocumentList(response?.data?.[0]?.user.certificates);
          setFilePath(response?.filePath || "");
        }
      } catch (error) {
        console.log("error :>> ", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      const specializationData =
        Array.isArray(values?.specialization) &&
        values.specialization.length > 0
          ? values.specialization.map((item: SelectOption) => item.value)
          : user?.specializations?.map((item: any) => item.id) || [];

      // If values.activities is updated, map it; otherwise, use existing user.activityIds
      const activityData =
        Array.isArray(values?.activities) && values.activities.length > 0
          ? values.activities.map((item: SelectOption) => item.value)
          : user?.activities?.map((item: any) => item.id) || [];

      const payload = {
        id: user?.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        about: values.about,
        addresses: [
          {
            id: user?.addresses?.[0]?.id || 0,
            address: values.address,
            city: values.city,
            state: values.state,
            country: values.country,
            pinCode: values.pinCode,
          },
        ],
        specializationIds: specializationData,
        activityIds: activityData,
        certificates: uploadResponse,
      };
      setLoading(true);
      const response = await AxiosPut(`${API_URLS.AUTH.UPDATE_INFO}`, payload);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        toast.success('Profile Updated Successfully');
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(`Error fetching user data ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>No user found</p>;

  const handleUploadSuccess = (data: any) => {
    setUploadResponse(data);
  };

  return (
    <div className="p-6">
      <Formik
        initialValues={{
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          phoneNumber: user?.phoneNumber || "",
          about: user?.about || "",
          address: user?.addresses?.[0]?.address || "",
          city: user?.addresses?.[0]?.city || "",
          state: user?.addresses?.[0]?.state || "",
          pinCode: user?.addresses?.[0]?.pinCode || "",
          country: user?.addresses?.[0]?.country || "",
          specialization: user?.specializations[0]?.specializationName || "",
          activities: user?.activities[0]?.activityName || "",
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
          <Form className="p-6 w-full mx-auto bg-white shadow rounded-lg">
            {/* Header Section */}
            <div className="relative pb-4">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg md:text-2x font-bold text-textPrimary-150">
                    PROFILE
                  </h2>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 md:gap-4 text-sm md:text-base mt-4 md:mt-0">
                  <button
                    type="submit"
                    className="bg-textPrimary-300 w-[132px] text-white px-4 py-2 rounded flex items-center justify-center gap-1 shadow hover:bg-green-600"
                    onClick={() => handleSubmit(values)}
                  >
                    Edit <FaPen />
                  </button>
                </div>
              </div>
              {/* Gradient Border */}
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
                    {`${user?.firstName}  ${
                      user?.lastName ? user.lastName : ""
                    }`}
                  </h2>
                  <p className=" text-xs md:text-[14px] text-textPrimary-250">
                    {user?.addresses?.length
                      ? `${user?.addresses?.[0].address} ${user?.addresses?.[0].city} ${user?.addresses?.[0].state} ${user?.addresses?.[0].country}`
                      : "Address not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-textPrimary-150 mb-8">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-6 relative">
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="firstName"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    First Name
                  </label>
                </div>

                <div className="mb-6 relative">
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    Last Name
                  </label>
                </div>

                <div className="mb-6 relative">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    Email
                  </label>
                </div>
                <div className="mb-6 relative">
                  <Field
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    Mobile Number
                  </label>
                </div>
                <div className="mb-6 relative col-span-3">
                  <Field
                    type="text"
                    id="about"
                    name="about"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="about"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    About
                  </label>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-textPrimary-150 mt-8 mb-8">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-6 relative col-span-2">
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="address"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    Full Address *
                  </label>
                </div>

                <div className="col-span-1 relative">
                  <label
                    className={`absolute left-3 text-gray-500 transition-all bg-white px-1 z-10
      ${selectedCountry ? "top-[-10px] text-base scale-75" : "top-3 text-base"}
    `}
                  >
                    Country *
                  </label>
                  <div className="w-full border border-zinc-300 rounded bg-white  p-2">
                    <Select
                      name="country"
                      options={countryList.map((country) => ({
                        value: country.isoCode,
                        label: country.name,
                      }))}
                      value={selectedCountry}
                      onChange={(selectedOption) => {
                        handleCountryChange(selectedOption);
                        setFieldValue("country", selectedOption?.value);
                        setFieldValue("state", "");
                        setFieldValue("city", "");
                      }}
                      placeholder=" "
                      classNamePrefix="react-select"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-1 relative">
                  <label
                    className={`absolute left-3 text-gray-500 transition-all bg-white px-1 z-10
      ${selectedState ? "top-[-10px] text-base scale-75" : "top-3 text-base"}
    `}
                  >
                    State *
                  </label>
                  <div className="w-full border border-zinc-300 rounded bg-white p-2">
                    <Select
                      name="state"
                      options={stateList.map((state) => ({
                        value: state.isoCode,
                        label: state.name,
                      }))}
                      value={selectedState}
                      onChange={(selectedOption) => {
                        handleStateChange(selectedOption);
                        setFieldValue("state", selectedOption?.value);
                        setFieldValue("city", "");
                      }}
                      placeholder=" "
                      classNamePrefix="react-select"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-1 relative">
                  <label
                    className={`absolute left-3 text-gray-500 transition-all bg-white px-1 z-10
      ${selectedCity ? "top-[-10px] text-base scale-75" : "top-3 text-base"}
    `}
                  >
                    City *
                  </label>
                  <div className="w-full border border-zinc-300 rounded bg-white p-2">
                    <Select
                      name="city"
                      options={cityList.map((city) => ({
                        value: city.name,
                        label: city.name,
                      }))}
                      value={selectedCity}
                      onChange={(selectedOption) => {
                        handleCityChange(selectedOption);
                        setFieldValue("city", selectedOption?.value);
                      }}
                      placeholder=" "
                      classNamePrefix="react-select"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="mb-6 relative">
                  <Field
                    type="number"
                    id="pinCode"
                    name="pinCode"
                    className="input border p-2 rounded-md w-full focus:outline-none peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="pinCode"
                    className="absolute left-3 text-gray-500 transition-all
                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                  >
                    Zip Code *
                  </label>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-textPrimary-150 mt-8 mb-8">
                Specialization
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 relative">
                  <label
                    className={`absolute left-3 text-gray-500 transition-all bg-white px-1 z-10
      ${
        selectedSpecialization
          ? "top-[-10px] text-base scale-75"
          : "top-3 text-base"
      }
    `}
                  >
                    Specialization
                  </label>
                  <div className="w-full border border-zinc-300 rounded bg-white p-2">
                    <Select
                      name="specialization"
                      options={specializationList.map((city) => ({
                        value: city.id,
                        label: city.specializationName,
                      }))}
                      value={selectedSpecialization}
                      onChange={(selectedOptions: MultiValue<SelectOption>) => {
                        setFieldValue("specialization", selectedOptions);
                        setSelectedSpecialization(selectedOptions);
                      }}
                      placeholder=" "
                      classNamePrefix="react-select"
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-1 relative">
                  <label
                    className={`absolute left-3 text-gray-500 transition-all bg-white px-1 z-10
      ${selectedActivity ? "top-[-10px] text-base scale-75" : "top-3 text-base"}
    `}
                  >
                    Activities
                  </label>
                  <div className="w-full border border-zinc-300 rounded bg-white p-2">
                    <Select
                      name="activities"
                      options={activityList.map((city) => ({
                        value: city.id,
                        label: city.activityName,
                      }))}
                      value={selectedActivity}
                      onChange={(selectedOptions: MultiValue<SelectOption>) => {
                        setFieldValue("activities", selectedOptions);
                        setSelectedActivity(selectedOptions);
                      }}
                      placeholder=" "
                      classNamePrefix="react-select"
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <CertificateUploader
        onUploadSuccess={handleUploadSuccess}
        documentList={documentList || []}
        filePath={filePath}
      />
    </div>
  );
}

export default Profile;
