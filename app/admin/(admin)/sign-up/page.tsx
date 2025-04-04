"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import PasswordVerify from "./passwordVerify";
import OTPVerify from "./otpVerify";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosPost } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { toast } from "react-toastify";
import { validationMessages } from "@/common/validations/validation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Loading from "@/components/common/loading";
import { signInWithGoogle, signInWithFacebook } from "../../../../lib/firebase";

const SignUp: React.FC = () => {
  const EmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const MobileRegex = /^\+?\d{10,15}$/;

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [isMobileInput, setIsMobileInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");

  const EmailValidation = Yup.object().shape({
    emailOrMobile: Yup.string()
      .required(validationMessages.required({ field: "Email or Mobile number" }))
      .test(
        "email-or-mobile",
        validationMessages.invalid({ field: "Email or Mobile number" }),
        (value) => {
          if (!value) return false;
          return EmailRegex.test(value) || MobileRegex.test(value);
        }
      ),
  });


  const HandleEmailOrMobileSubmit = async (values: { emailOrMobile: string }) => {
    setIsLoading(true);
    const { emailOrMobile } = values;
    const isMobile = MobileRegex.test(emailOrMobile);
    const isEmail = EmailRegex.test(emailOrMobile);

    if (isMobile) {
      const payload = { phoneNumber: emailOrMobile, roleId: roleId };

      AxiosPost(`${API_URLS.AUTH.SIGN_UP}`, payload)
        .then((response) => {
          if (response && typeof response !== "string" && response.statusCode === 200) {
            setInputType("mobile");
            toast.success(response?.message, { autoClose: 2000 });
          }
          else {
            router.push('/role')
          }
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          toast.error("Failed to send OTP", { autoClose: 2000 });
        })
        .finally(() => {
          setStep(2);
          setEmailOrMobile(emailOrMobile);
          setIsLoading(false);
        });

    } else if (isEmail) {
      setInputType("email");
      setStep(2);
      setEmailOrMobile(emailOrMobile);
      setIsLoading(false);
    } else {
      console.log("Invalid input format!");
      toast.error("Invalid email or phone number", { autoClose: 2000 });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sign-Up";
  }, []);

  const handlePasswordSubmit = async (values: string) => {
    setIsLoading(true);
    const isMobile = MobileRegex.test(emailOrMobile);
    const isEmail = EmailRegex.test(emailOrMobile);
    let payload = {};

    if (isMobile) {
      payload = { phoneNumber: emailOrMobile, otp: values || "" };

      AxiosPost(`${API_URLS.AUTH.VERIFY_OTP}`, payload)
        .then((response) => {
          if (response && typeof response !== "string" && response.statusCode === 200) {
            toast.success(response?.message, { autoClose: 2000 });
            const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
            router.push(url);
          }
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
          toast.error("Failed to verify OTP", { autoClose: 2000 });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (isEmail) {
      payload = { email: emailOrMobile, password: values, roleId: roleId };

      AxiosPost(`${API_URLS.AUTH.SIGN_UP}`, payload)
        .then((response) => {
          if (response && typeof response !== "string" && response.statusCode === 200) {
            toast.success(response?.message, { autoClose: 2000 });
            const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
            router.push(url);
          } else {
            toast.error(
              typeof response === "string" ? response : response?.message || "Signup failed",
              { autoClose: 2000 }
            );
          }
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          toast.error("Something went wrong", { autoClose: 2000 });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error("Invalid input", { autoClose: 2000 });
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const userData = await signInWithGoogle();
    googleSignUp(userData?.providerData[0]?.email ?? '')
  };

  const googleSignUp = (email: string) => {
    const payload = { email: email, password: "Test@123", roleId: roleId };

    AxiosPost(`${API_URLS.AUTH.SIGN_UP}`, payload)
      .then((response) => {
        if (response && typeof response !== "string" && response.statusCode === 200) {
          toast.success(response?.message, { autoClose: 2000 });
          const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
          router.push(url);
        } else {
          toast.error(
            typeof response === "string" ? response : response?.message || "Signup failed",
            { autoClose: 2000 }
          );
        }
      })
  }

  // const handleFacebookLogin = async () => {
  //   const userData = await signInWithFacebook();
  //  console.log(userData, "userdata")
  // };


  return (
    <div className="flex py-8 bg-background-primary items-center justify-center min-h-screen flex-col bg-[rgba(76, 76, 92, 0.1)] px-4 sm:px-6">
      <div className={`p-6 sm:p-8 rounded-lg border border-transparent bg-white max-w-[90%] w-full sm:w-[621px] pt-6 sm:pt-10 pb-6 sm:pb-10 ${step === 1 ? "h-[808px]" : "h-auto sm:h-[608px]"}`}>
        <Image className="m-auto" alt="footer-logo" src="/Image/logo.svg" width="184" height="132" />
        <div className="w-full my-6 h-[1px] bg-gradient-to-r from-transparent via-green-700 to-transparent"></div>

        <h2 className="text-2xl sm:text-3xl text-textPrimary-150 font-medium text-left mb-2">
          Welcome to
          <span className="font-semibold text-textPrimary-customGreen"> Gravitrain</span>
        </h2>
        <div>
          {step === 1 && (
            <div>
              <span className="font-normal text-textPrimary-250 text-sm sm:text-base">
                Welcome ! Please enter your details
              </span>
              <div className="my-6">
                <Formik initialValues={{ emailOrMobile: "" }} validationSchema={EmailValidation} onSubmit={HandleEmailOrMobileSubmit}>
                  {({ values, handleChange, setFieldValue }) => (
                    <Form>

                      <div className="mb-6 mt-10 relative">
                        {isMobileInput ? (
                          <>
                            <PhoneInput
                              defaultCountry="us"
                              value={values.emailOrMobile}
                              onChange={(phone) => {
                                setFieldValue("emailOrMobile", phone);
                              }}
                              className="custom-phone-input"
                            />

                            <label
                              className={`absolute left-4 text-gray-500 transition-all ${values.emailOrMobile
                                ? "scale-75 -top-2 bg-white px-1"
                                : "top-2 text-base"
                                }`}
                            >
                              Email ID or Mobile Number <span className="text-red-500">*</span>
                            </label>
                          </>
                        ) : (
                          <>
                            <Field
                              type="text"
                              id="emailOrMobile"
                              name="emailOrMobile"
                              className="input border p-2 rounded-md w-full focus:outline-none peer"
                              placeholder=" "
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                                const value = e.target.value;
                                const numericCount = (value.match(/\d/g) || []).length;
                                const isPhone = numericCount >= 5;
                                setIsMobileInput(isPhone);
                              }}
                            />
                            <label
                              htmlFor="emailOrMobile"
                              className="absolute left-3 text-gray-500 transition-all
             peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
             peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
             peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                            >
                              Email ID or Mobile Number <span className="text-red-500">*</span>
                            </label>
                          </>
                        )}
                        <ErrorMessage component="div" name="emailOrMobile" className="text-red-500 text-sm" />
                      </div>

                      <div className="flex justify-center mt-10">
                        <button type="submit"
                          disabled={isLoading}
                          className="items-center text-lg sm:text-xl mt-4 w-full sm:w-[276px] h-[50px] sm:h-[55px] flex justify-center bg-background-green text-white py-2 rounded hover:bg-green-700">
                          {isLoading ? (<Loading />) : 'Continue'}
                        </button>
                      </div>
                      <div className="flex justify-center mt-5">
                        <button onClick={() => router.push("/role")} type="button" className="items-center text-lg sm:text-xl font-normal w-full sm:w-[276px] h-[50px] sm:h-[55px] flex justify-center bg-white py-2 rounded border border-gray-300 hover:bg-gray-100">
                          Back
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="flex items-center my-10">
                  <div className="flex-grow border-t border-[#0000001A]"></div>
                  <span className="mx-4 text-gray-500">Or</span>
                  <div className="flex-grow border-t border-[#0000001A]"></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <button onClick={handleLogin} className="flex items-center h-[50px] sm:h-[55px] bg-background-primary justify-center border border-gray-300 py-2 px-4 rounded-full w-full sm:w-1/2 hover:bg-gray-100">
                    <Image src="/Image/Google.svg" alt="Google Logo" width={30} height={30} className="mr-2" />
                    <span className="text-[15px] font-normal text-textPrimary-grey">Continue with Google</span>
                  </button>
                  <button
                  //  onClick={handleFacebookLogin}
                  disabled
                    className="flex items-center h-[50px] sm:h-[55px] bg-background-primary justify-center border border-gray-300 py-2 px-4 rounded-full w-full sm:w-1/2 hover:bg-gray-100">
                    <Image src="/Image/Facebook.svg" alt="Facebook Logo" width={30} height={30} className="mr-2" />
                    <span className="text-[15px] font-normal text-textPrimary-grey">Continue with Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && inputType === "email" && <PasswordVerify onPasswordSubmit={handlePasswordSubmit} isLoading={isLoading} setIsLoading={setIsLoading} />}

          {step === 2 && inputType === "mobile" && <OTPVerify onOTPSubmit={handlePasswordSubmit} />}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
