"use client";

import { doLogin } from "@/Auth";
import { AxiosPost } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { validationMessages } from "@/common/validations/validation";
import { useAuth } from "@/context/AuthContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Loading from "@/components/common/loading";
import { signInWithGoogle } from "@/lib/firebase";

const Login: React.FC = () => {
  const [inputVisibility, setInputVisibility] = useState<boolean>(false);
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
  const [isOtpSent, setIsOtpSend] = useState<boolean>(false)
  const [isMobileInput, setIsMobileInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialCode, setDialCode] = useState<string | undefined>(undefined);
  const router = useRouter()
  const { login } = useAuth();

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const EmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const MobileRegex = /^\+?\d{10,15}$/;
  const OtpRegex = /^\d{6}$/;

  const ValidationSchema = Yup.object().shape({
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

    password: Yup.string().when("emailOrMobile", {
      is: (val: string) => EmailRegex.test(val),
      then: (schema) => schema.required(validationMessages.required({ field: "Password" })),
    }),

    otp: Yup.string().when(["emailOrMobile", "isOtpSent"], {
      is: (emailOrMobile: string, isOtpSent: boolean) =>
        MobileRegex.test(emailOrMobile) && isOtpSent,
      then: (schema) =>
        schema
          .required(validationMessages.required({ field: "OTP" }))
          .min(6, validationMessages.exactLength({ field: "OTP", count: 6 }))
          .max(6, validationMessages.exactLength({ field: "OTP", count: 6 }))
          .matches(OtpRegex, validationMessages.invalid({ field: "OTP" })),
    }),
  });

  const handleOtpChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    values: { otp: string },
    setFieldValue: (field: string, value: string) => void
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const otpArray = values.otp.split("");
    otpArray[index] = value;
    setFieldValue("otp", otpArray.join(""));

    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    values: { otp: string },
    setFieldValue: (field: string, value: string) => void
  ) => {
    if (e.key === "Backspace" && !values.otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
      const otpArray = values.otp.split("");
      otpArray[index - 1] = "";
      setFieldValue("otp", otpArray.join(""));
    }
  };

  const handleSubmit = async (values: { emailOrMobile: string; password?: string; otp?: string }) => {
    setIsLoading(true)
    try {
      let payload: Record<string, string> = {};
      const isMobile = MobileRegex.test(values.emailOrMobile);

      if (isMobile && !isOtpSent) {
        const phoneNumber = dialCode ? `${values.emailOrMobile}` : `+1${values.emailOrMobile}`
        payload = { phoneNumber, deviceType: 'web' };

        const response = await AxiosPost(`${API_URLS.AUTH.LOGIN}`, payload);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          if(response.data[0].isProfileComplete){
            setIsOtpSend(true);
            doLogin({ ...response.data[0], filePath: 'response.filePath' });
            login(response.data[0]);
            toast.success(response?.message || "OTP sent successfully1", { autoClose: 2000 });
          }
          else{
            const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
            router.push(url);
          }
        }
      } else if (isMobile && isOtpSent) {
        payload = { phoneNumber: `${values.emailOrMobile}`, otp: values.otp || "" };

        const response = await AxiosPost(`${API_URLS.AUTH.VERIFY_OTP}`, payload);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          router.push('/dashboard');
          toast.success(`${response.message}`, { autoClose: 2000 });
        }
      } else {
        payload = {
          email: values.emailOrMobile,
          deviceType: 'web',
          ...(values.password && { password: values.password }),
        };

        const response = await AxiosPost(`${API_URLS.AUTH.LOGIN}`, payload);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          if(response.data[0].isProfileComplete){
            toast.success(`${response.message}`, { autoClose: 2000 });
            doLogin({ ...response.data[0], filePath: 'response.filePath' });
            login(response.data[0]);
            router.push('/dashboard');
          }
          else{
            const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
            router.push(url);
          }
        }
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', {
        toastId: 'nodata',
        autoClose: 1000
      });
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleLogin = async () => {
    const userData = await signInWithGoogle();
    checkGoogleLogin(userData?.providerData[0]?.email ?? '')
  };

  const checkGoogleLogin = async (email: string) => {
    const payload = {
      email,
      deviceType:'web'
    };

    const response = await AxiosPost(`${API_URLS.AUTH.GOOGLE_LOGIN}`, payload);
    if (response && typeof response !== 'string' && response.statusCode === 200) {
      if(response.data[0].isProfileComplete){
        toast.success(`${response.message}`, { autoClose: 2000 });
        doLogin({ ...response.data[0], filePath: 'response.filePath' });
        login(response.data[0]);
        router.push('/dashboard');
      }
      else{
        const url = `/admin/sign-up/info?userId=${encodeURIComponent(response?.data?.[0]?.id ?? "")}`;
        router.push(url);
      }
    }
    else{
      const message = (response as any)?.message || response || 'An error occurred';
      toast.error(message, { autoClose: 2000 });
    }
  }

  return (
    <div className="flex bg-[rgba(76, bg-background-primary h-screen justify-center 0.1)] 76, 92, items-center min-h-screen py-96 sm:px-6">
      <div className="bg-white border border-transparent h-auto p-6 rounded-lg w-full max-w-[90%] sm:h-auto sm:p-8 sm:w-[621px]">
        <Image
          className="m-auto"
          alt="footer-logo"
          src="/Image/logo.svg"
          width="184"
          height="132"
        />
        <div className="bg-gradient-to-r h-[1px] w-full from-transparent my-6 to-transparent via-green-700"></div>

        <h2 className="text-2xl text-left text-textPrimary-150 font-medium mb-2 sm:text-3xl">
          Welcome Back to
          <span className="text-textPrimary-customGreen font-semibold">
            {" "}
            Gravitrain
          </span>
        </h2>
        <span className="text-sm text-textPrimary-250 font-normal sm:text-base pt-2">
          Welcome back! Please enter your details
        </span>
        <div className="my-6">
          <Formik
            initialValues={{ emailOrMobile: "", password: "", otp: "" }}
            validationSchema={ValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, setFieldValue, values }) => (
              <Form>
                <div className="mb-6 mt-10 relative">
                  {isMobileInput ? (
                    <>
                      <PhoneInput
                        defaultCountry="us"
                        value={values.emailOrMobile}
                        onChange={(phone, countryData) => {
                          setFieldValue("emailOrMobile", phone);
                          setDialCode(countryData?.country?.dialCode);
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
                        disabled={isOtpSent}
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
                          setShowPasswordField(EmailRegex.test(value));
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

                {showPasswordField && (
                  <div className="mb-6 mt-10 relative">
                    <Field
                      type={inputVisibility ? "text" : "password"}
                      id="password"
                      name="password"
                      className="input border p-2 rounded-md w-full focus:outline-none peer pr-10"
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className="text-gray-500 absolute left-3 peer-focus:bg-white peer-focus:px-1 peer-focus:scale-75 peer-focus:translate-y-[-50%] peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-4 transition-all"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      className="flex text-gray-600 absolute inset-y-0 items-center right-2"
                      onClick={() => setInputVisibility(!inputVisibility)}
                    >
                      {inputVisibility ? <BsEyeSlash /> : <BsEye />}
                    </button>
                    <ErrorMessage component="div" name="password" className="text-red-500 text-sm" />
                  </div>
                )}

                {isMobileInput && isOtpSent && (
                  <div className="mb-6">
                    <label className="text-[15px] text-textPrimary-grey block font-normal mb-2">OTP</label>
                    <div className="flex justify-between">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          ref={otpRefs[index]}
                          type="text"
                          maxLength={1}
                          className="border border-gray-300 h-[35px] p-2 rounded text-center text-lg w-[35px] sm:h-[60px] sm:w-[70px]"
                          value={values.otp[index] || ""}
                          onChange={(e) => handleOtpChange(index, e, values, setFieldValue)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e, values, setFieldValue)}
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      component="div"
                      name="otp"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}
                <div className="flex justify-center mt-10">
                  <button type="submit"
                    disabled={isLoading}
                    className="flex bg-background-green h-[50px] justify-center rounded text-lg text-white w-full items-center mt-4 py-2 sm:h-[55px] sm:text-xl sm:w-[276px]">

                    {isLoading ? (
                      <Loading />
                    ) :
                      (isMobileInput ? 'Send OTP' : 'Log In')
                    }
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
            <button disabled className="flex items-center h-[50px] sm:h-[55px] bg-background-primary justify-center border border-gray-300 py-2 px-4 rounded-full w-full sm:w-1/2 hover:bg-gray-100">
              <Image src="/Image/Facebook.svg" alt="Facebook Logo" width={30} height={30} className="mr-2" />
              <span className="text-[15px] font-normal text-textPrimary-grey">Continue with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Login;