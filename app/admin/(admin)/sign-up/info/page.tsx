"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { validationMessages } from "@/common/validations/validation";
import { AxiosGet, AxiosPut } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { toast } from "react-toastify";
import Select, { MultiValue } from "react-select";
import { ActivityList, CityList, CountryList, CountryOption, InterestList, Role, SelectOption, SpecializationList, StateList } from "@/common/constants/interface";
import { useRouter, useSearchParams } from "next/navigation";
import { UserInfo } from "@/common/constants/type";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const Signup = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const router = useRouter()

    const [step, setStep] = useState(1);
    const [countryList, setCountryList] = useState<CountryList[]>([])
    const [stateList, setStateList] = useState<StateList[]>([])
    const [cityList, setCityList] = useState<CityList[]>([])
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
    const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
    const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
    const [specializationList, setSpecializationList] = useState<SpecializationList[]>([])
    const [activityList, setActivityList] = useState<ActivityList[]>([])
    const [interestList, setInterestList] = useState<InterestList[]>([])
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>({});


    const [basicInfo, setBasicInfo] = useState({
        firstName: "",
        lastName: "",
        email: userInfo?.email || "",
        mobile: userInfo?.phoneNumber || "",
        gender: "",
    });

    const [personalInfo, setPersonalInfo] = useState({
        address: "",
        country: "",
        state: "",
        city: "",
        interest: [],
        weightValue: "",
        weightUnit: "kg",
        heightValue: "",
        heightUnit: "cm",
        about: "",
        specialization: [],
        activities: [],
    });

    const basicInfoSchema = Yup.object().shape({
        firstName: Yup.string().required(validationMessages.required({ field: "First name" })),
        lastName: Yup.string().required(validationMessages.required({ field: "Last name" })),
        email: Yup.string()
            .email(validationMessages.invalid({ field: "Email" }))
            .required(validationMessages.required({ field: "Email" })),
        mobile: Yup.string()
            .matches(/^\+?\d{10,15}$/, validationMessages.custom({ field: "Mobile number", message: "must be between 10 to 15 digits" }))
            .required(validationMessages.required({ field: "Mobile number" })),
        gender: Yup.string().required(validationMessages.required({ field: "Gender" })),
    });

    const personalInfoSchema = Yup.object().shape({
        address: Yup.string()
            .required(validationMessages.required({ field: "Address" }))
            .max(100, validationMessages.maxLength({ field: "Address", count: 100 })),
        country: Yup.string().required(validationMessages.required({ field: "Country" })),
        state: Yup.string().required(validationMessages.required({ field: "State" })),
        city: Yup.string().required(validationMessages.required({ field: "City" })),
        // interest: Yup.array().when("currentRole", {
        //     is: "Trainee",
        //     then: (schema) => schema.min(1, "At least one Interest is required").required("Interest is required"),
        //     otherwise: (schema) => schema.notRequired(),
        // }),
        weightValue: Yup.number()
            .integer(validationMessages.custom({ field: "Weight", message: "must be a whole number" }))
            .positive(validationMessages.positive({ field: "Weight" }))
            .max(999, validationMessages.custom({ field: "Weight", message: "cannot exceed 999" }))
            .required(validationMessages.required({ field: "Weight" })),
        heightValue: Yup.number()
            .positive(validationMessages.positive({ field: "Height" }))
            .required(validationMessages.required({ field: "Height" }))
            .test(
                "decimal-format",
                validationMessages.custom({ field: "Height", message: "must have at most 3 digits before the decimal and up to 3 decimal places" }),
                (value) => value === undefined || /^(\d{1,3})(\.\d{1,3})?$/.test(value.toString())
            ),
        about: Yup.string().required(validationMessages.required({ field: "About" })),
        // specialization: Yup.array().when("currentRole", {
        //     is: "Trainer",
        //     then: (schema) => schema.min(1, "At least one specialization is required").required("Specialization is required"),
        //     otherwise: (schema) => schema.notRequired(),
        // }),
    });

    const handleSubmit = async (values: any) => {
        const interestData = values.interest.map((item: SelectOption) => item.value);
        const specializationData = values.specialization.map((item: SelectOption) => item.value);
        const activityData = values.activities.map((item: SelectOption) => item.value);
        const payload = {
            id: userId,
            email: basicInfo.email,
            phoneNumber: basicInfo.mobile,
            firstName: basicInfo.firstName,
            lastName: basicInfo.lastName,
            gender: basicInfo.gender,
            interestIds: interestData,
            weight: values.weightValue,
            height: values.heightValue,
            about: values.about,
            specializationIds: specializationData,
            activityIds: activityData,
            addresses: [
                {
                    "address": values.address,
                    "city": selectedCity?.value,
                    "state": selectedState?.value,
                    "country": selectedCountry?.value
                }
            ],
            isProfileComplete: true
        }

        const response = await AxiosPut(`${API_URLS.AUTH.EDIT_DETAILS}`, payload);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
            toast.success(`${response.message}`, { autoClose: 2000 });
            router.push(`/thank-you?role=${currentRole}`);
        }
        else {
            toast.error(
                typeof response === "string" ? response : response?.message || "Signup failed",
                { autoClose: 2000 }
            );
        }
    }

    const getCountryList = async () => {
        try {
            const response = await AxiosGet(`${API_URLS.ADDRESS.COUNTRY}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setCountryList(response.data)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getStateList = async (id: string) => {
        try {
            const response = await AxiosGet(`${API_URLS.ADDRESS.STATE}/${id}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setStateList(response.data)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getCityList = async (id: string) => {
        try {
            const response = await AxiosGet(`${API_URLS.ADDRESS.CITY}/${selectedCountry?.value}/${id}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setCityList(response.data)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getSpecializationList = async () => {
        try {
            const response = await AxiosGet(`${API_URLS.AUTH.SPECIALIZATION}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setSpecializationList(response.data)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getActivityList = async () => {
        try {
            const response = await AxiosGet(`${API_URLS.ACTIVITY.LIST}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setActivityList(response.data)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getInterestList = async () => {
        try {
            const response = await AxiosGet(`${API_URLS.AUTH.INTEREST}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                setInterestList(response.data)
            }
        } catch (error) {
            console.error('Error fetching Interest list:', error);
            return null;
        }
    };


    const getRoleList = async (roleId: any) => {
        try {
            const response = await AxiosGet(`${API_URLS.AUTH.ROLE}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                const role = (response.data as Role[]).find((role) => role.id == Number(roleId));
                if (role) {
                    setCurrentRole(role.displayName);
                }
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
            return null; // Handle error case
        }
    };

    const getUserDetail = async () => {
        try {
            const response = await AxiosGet(`${API_URLS.AUTH.USER_PROFILE}/${userId}`);

            if (response && typeof response !== 'string' && response.statusCode === 200) {
                getRoleList(response?.data[0].user.roleId)
                setUserInfo(response?.data[0].user)
            }
        } catch (error) {
            console.error('Error fetching role list:', error);
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
        getCountryList()
        getSpecializationList()
        getActivityList()
        getInterestList()
        getUserDetail()
    }, [])

    useEffect(() => {
        if (userInfo) {
            setBasicInfo((prev) => ({
                ...prev,
                email: userInfo.email || prev.email,
                mobile: userInfo.phoneNumber || prev.mobile,
            }));
        }
    }, [userInfo]);

    return (
        <div className="flex h-auto">
            <div className="flex bg-gray-100 justify-center p-6 w-full items-center md:w-[65%] sm:p-10">
                <div
                    className={`w-full h-auto bg-white p-6 sm:p-8 rounded-2xl shadow-md 
                    ${step === 1 ? " sm:max-h-[1200px]" : " sm:max-h-[1500px]"}`
                    }
                >
                    <div className="flex justify-between items-center mb-4 mt-20 sm:mb-6">
                        <h2 className="text-3xl text-center text-textPrimary-black font-medium sm:text-left">
                            Share Your Story – <span className="text-3xl text-textPrimary-green font-medium"> Let’s Get to Know You!</span>
                        </h2>
                    </div>
                    <div className="bg-gradient-to-r h-[1px] w-full from-[#d9a1391a] relative to-[#d9a1391a] via-[#D9A139]"></div>

                    {step === 1 && (
                        <Formik
                            enableReinitialize
                            initialValues={basicInfo}
                            validationSchema={basicInfoSchema}
                            onSubmit={(values) => {
                                setBasicInfo(values);
                                setStep(2);
                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <span className="flex justify-end text-gray-500 pt-5">0{step}/02</span>
                                    <div className="flex items-center mb-4">
                                        <span className="flex bg-[#37695F1A] h-[70px] justify-center rounded-[5px] text-[35px] text-textPrimary-grey w-[70px] font-medium items-center mr-4 px-3 py-1">01</span>
                                        <h3 className="text-lg text-textPrimary-grey font-normal">Basic Information</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                                        <div className="mb-2 relative">
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
                                                Enter First Name <span className="text-red-500">*</span>
                                            </label>
                                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="mb-2 relative">
                                            <Field
                                                type="text"
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
                                                Enter Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="mb-2 relative">
                                            <Field
                                                type="email"
                                                name="email"
                                                className="input border p-2 rounded-md w-full focus:outline-none peer"
                                                placeholder=" "
                                                disabled={basicInfo.email}
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-3 text-gray-500 transition-all
            peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
            peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
            peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                            >
                                                Enter Email <span className="text-red-500">*</span>
                                            </label>
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="mb-6 relative">
                                            <PhoneInput
                                                value={values.mobile}
                                                disabled={!!basicInfo.mobile}
                                                defaultCountry="us"
                                                onChange={(phone) => setFieldValue("mobile", phone)}
                                                className="custom-phone-input"
                                            />

                                            <label
                                                className={`absolute text-gray-500 transition-all
                                                    ${values.mobile || !!basicInfo.mobile
                                                        ? "scale-75 -top-2 bg-white px-1"
                                                        : "text-base left-20 top-3"
                                                    }
                                                `}
                                            >
                                                Mobile Number <span className="text-red-500">*</span>
                                            </label>

                                            <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                                        </div>


                                        <div className="mb-2 relative">
                                            <Field
                                                as="select"
                                                name="gender"
                                                className="input border p-2 rounded-md w-full focus:outline-none peer"
                                            >
                                                <option value="">Select Gender *</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </Field>
                                            <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button type="submit" className="flex bg-background-green h-[55px] justify-center rounded text-white text-xl w-[128px] items-center mt-4 py-2">
                                            Next
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {step === 2 && (
                        <Formik
                            initialValues={personalInfo}
                            validationSchema={personalInfoSchema}
                            onSubmit={(values) => {
                                setPersonalInfo(values); // Save values in state
                                handleSubmit(values)
                                console.log("Final Submission", values, basicInfo);
                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <span className="flex justify-end text-gray-500 pt-5">0{step}/02</span>
                                    <div className="flex items-center mb-4">
                                        <span className="flex bg-[#37695F1A] h-[70px] justify-center rounded-[5px] text-[35px] text-textPrimary-grey w-[70px] font-medium items-center mr-4 px-3 py-1">02</span>
                                        <h3 className="text-lg text-textPrimary-grey font-normal">Personal Information</h3>
                                    </div>

                                    <div className="mb-2 relative">
                                        <Field
                                            type="text"
                                            name="address"
                                            className="input border p-2 rounded-md w-full focus:outline-none peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="address"
                                            className="absolute left-3 top-0 text-gray-500 transition-all
            peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
            peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
            peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                        >
                                            Enter Address <span className="text-red-500">*</span>
                                        </label>
                                        <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                                        <div className="relative">
                                            <label className="block text-gray-700 mb-1">
                                                Country <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-full border border-zinc-300 rounded bg-white p-2">
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
                                                        setFieldValue("state", '');
                                                        setFieldValue("city", '');
                                                    }}
                                                    placeholder="Select Country"
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
                                            <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-gray-700 mb-1">
                                                State <span className="text-red-500">*</span>
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
                                                        setFieldValue("city", '');
                                                    }}
                                                    placeholder="Select State"
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
                                            <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                                        <div className="relative">
                                            <label className="block text-gray-700 mb-1">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <div>
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
                                                    placeholder="Select City"
                                                    classNamePrefix="react-select"
                                                    className="react-select-container"
                                                />
                                                <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-gray-700 mb-1">
                                                Activities
                                            </label>
                                            <div>
                                                <Select
                                                    name="activities"
                                                    options={activityList
                                                        .filter((city) => city.isActive)
                                                        .map((city) => ({
                                                            value: city.id,
                                                            label: city.activityName,
                                                        }))}
                                                    value={values.activities}
                                                    onChange={(selectedOptions: MultiValue<SelectOption>) =>
                                                        setFieldValue("activities", selectedOptions)
                                                    }
                                                    placeholder="Select a Activity"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    isMulti
                                                />
                                                <ErrorMessage name="activities" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {currentRole == 'Trainer' && <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                        <div className="mt-7">
                                            <Select
                                                name="specialization"
                                                options={specializationList
                                                    .filter((city) => city.isActive)
                                                    .map((city) => ({
                                                        value: city.id,
                                                        label: city.specializationName,
                                                    }))}
                                                value={values.specialization}
                                                onChange={(selectedOptions: MultiValue<SelectOption>) =>
                                                    setFieldValue("specialization", selectedOptions)
                                                }
                                                placeholder="Select a Specialization"
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isMulti
                                            />
                                            <ErrorMessage name="specialization" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    }


                                    {currentRole == 'Trainee' && <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                        <div className="mt-7">
                                            <Select
                                                name="interest"
                                                options={interestList
                                                    .filter((int) => int.isActive)
                                                    .map((int) => ({
                                                        value: int.id,
                                                        label: int.interestName,
                                                    }))}
                                                value={values.interest}
                                                onChange={(selectedOptions: MultiValue<SelectOption>) =>
                                                    setFieldValue("interest", selectedOptions)
                                                }
                                                placeholder="Select a Interest"
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isMulti
                                            />
                                            <ErrorMessage name="interest" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    }

                                    <div className="grid grid-cols-1 gap-4 mt-7 md:grid-cols-2">
                                        {/* Weight Field */}
                                        <div className="w-full">
                                            <div className="flex gap-2 w-full">
                                                <Field as="select" name="weightUnit" className="form-select1 border p-2 rounded w-[77px]">
                                                    <option value="kg">KG</option>
                                                    <option value="lbs">LBS</option>
                                                </Field>

                                                <div className="mb-2 relative w-full">
                                                    <Field
                                                        type="number"
                                                        name="weightValue"
                                                        className="input border p-2 rounded-md w-full focus:outline-none peer"
                                                        placeholder=" "
                                                    />
                                                    <label
                                                        htmlFor="weightValue"
                                                        className="absolute left-3 top-0 text-gray-500 transition-all
                                                        peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                                                        peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                                                        peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                                    >
                                                        Enter Weight <span className="text-red-500">*</span>
                                                    </label>
                                                    <ErrorMessage name="weightValue" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Height Field */}
                                        <div className="w-full">
                                            <div className="flex gap-2 w-full">
                                                <Field as="select" name="heightUnit" className="form-select1 border p-2 rounded w-[77px]">
                                                    <option value="cm">CM</option>
                                                    <option value="ft">FT</option>
                                                </Field>

                                                <div className="mb-2 relative w-full">
                                                    <Field
                                                        type="number"
                                                        name="heightValue"
                                                        className="input border p-2 rounded-md w-full focus:outline-none peer"
                                                        placeholder=" "
                                                    />
                                                    <label
                                                        htmlFor="heightValue"
                                                        className="absolute left-3 top-0 text-gray-500 transition-all
                                                        peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                                                        peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                                                        peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                                    >
                                                        Enter Height <span className="text-red-500">*</span>
                                                    </label>
                                                    <ErrorMessage name="heightValue" component="div" className="text-red-500 text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 gap-2 mt-6">

                                        <div className="mb-2 relative">
                                            <Field
                                                as="textarea"
                                                name="about"
                                                className="input-textarea border p-2 rounded-md w-full focus:outline-none peer "
                                                placeholder=" "
                                            />
                                            <label
                                                htmlFor="about"
                                                className="absolute left-3 top-0 text-gray-500 transition-all 
            peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
            peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
            peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                            >
                                                About You <span className="text-red-500">*</span>
                                            </label>
                                            <ErrorMessage name="about" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-4 mt-6 sm:flex-row">
                                        <div className="flex justify-center my-5">
                                            <button onClick={() => setStep(1)} type="button" className="flex bg-white border border-gray-300 h-[50px] justify-center rounded text-lg w-full font-normal hover:bg-gray-100 items-center py-2 sm:h-[55px] sm:text-xl sm:w-[128px]">
                                                Back
                                            </button>
                                        </div>
                                        <div className="flex justify-center my-5">
                                            <button type="submit" className="flex bg-background-green h-[50px] justify-center rounded text-lg text-white w-full hover:bg-green-700 items-center py-2 sm:h-[55px] sm:text-xl sm:w-[128px]">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>

            <div className="sticky top-0 justify-center w-[35%] hidden md:flex">
                <Image
                    src={step === 1 ? "/Image/SignUp.svg" : "/Image/SignUp2.svg"}
                    alt="Signup Illustration"
                    width={550}
                    height={500}
                    className="h-screen w-full object-cover sticky top-0"
                />
            </div>
        </div>


    );
};

export default Signup;
