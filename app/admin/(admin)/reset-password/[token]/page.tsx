"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { validationMessages } from "@/common/validations/validation";
import Image from "next/image";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { AxiosPost } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const ResetPassword = () => {

    const params = useParams();
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const passwordValidation = Yup.object().shape({
        password: Yup.string()
            .min(6, validationMessages.minLength({ field: "Password", count: 6 }))
            .required(validationMessages.required({ field: "Password" })),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords must match")
            .required(validationMessages.required({ field: "Confirm Password" })),
    });

    const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {

        const payload = {
            newPassword: values.password,
            token: params.token
        };

        const response = await AxiosPost(`${API_URLS.AUTH.RESET_PASSWORD}`, payload);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
            toast.success(`${response.message}`, { autoClose: 2000 });
            router.push('/success')
        }
    };

    return (
        <div className="flex py-8 bg-background-primary items-center justify-center min-h-screen flex-col bg-[rgba(76, 76, 92, 0.1)] px-4 sm:px-6">
            <div className="p-6 sm:p-8 rounded-lg border border-transparent bg-white max-w-[90%] w-full sm:w-[621px] pt-6 sm:pt-10 pb-6 sm:pb-10 h-auto sm:h-[608px]">
                <Image className="m-auto" alt="footer-logo" src="/Image/logo.svg" width="184" height="132" />
                <div className="w-full my-6 h-[1px] bg-gradient-to-r from-transparent via-green-700 to-transparent"></div>

                <h2 className="text-2xl sm:text-3xl text-textPrimary-150 font-medium text-left mb-2">
                    Create new password
                </h2>
                <span className="font-normal text-textPrimary-250 text-sm">Your new password must be different from previous used password.</span>

                <div className="my-6">
                    <Formik initialValues={{ password: "", confirmPassword: "" }} validationSchema={passwordValidation} onSubmit={handlePasswordSubmit}>
                        {() => (
                            <Form>
                                <div className="relative mb-6">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="input peer w-full p-2 border rounded-md focus:outline-none"
                                        placeholder="Password"
                                    />
                                    <label
                                        htmlFor="password"
                                        className="absolute left-3 text-gray-500 transition-all
                                                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                                                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                                                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="top-1/2 transform -translate-y-1/2 absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    >
                                        {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                                    </button>
                                    <div className="absolute bottom-[-20px] left-0 text-sm text-red-500">
                                        <ErrorMessage component="div" name="password" className="text-sm text-red-500" />
                                    </div>
                                </div>
                                <div className="relative mb-6 pt-4">
                                    <Field
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="input peer w-full p-2 border rounded-md focus:outline-none"
                                        placeholder="Confirm Password"
                                    />
                                    <label
                                        htmlFor="confirmPassword"
                                        className="absolute left-3 text-gray-500 transition-all
                                                peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
                                                peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
                                                peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                                    >
                                        Confirm Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="top-1/2 transform -translate-y-1/2 absolute inset-y-0 right-3 flex items-center text-gray-500"
                                    >
                                        {showConfirmPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                                    </button>
                                    <div className="absolute bottom-[-20px] left-0 text-sm text-red-500">
                                        <ErrorMessage component="div" name="confirmPassword" className="text-sm text-red-500" />
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button type="submit" className="items-center text-xl mt-4 w-[276px] h-[55px] flex justify-center bg-background-green text-white py-2 rounded hover:bg-green-700">
                                        Reset Password
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
