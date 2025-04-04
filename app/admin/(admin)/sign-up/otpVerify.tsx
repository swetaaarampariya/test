import { validationMessages } from "@/common/validations/validation";
import { ErrorMessage, Form, Formik } from "formik"
import { useRef } from "react";
import * as Yup from "yup";

const OTPVerify = ({ onOTPSubmit }: { onOTPSubmit: (password: string) => void }) => {
  const OtpRegex = /^\d{6}$/;

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const otpValidation = Yup.object().shape({
    otp: Yup.string()
      .required(validationMessages.required({ field: "OTP" }))
      .min(6, validationMessages.minLength({ field: "OTP", count: 6 }))
      .max(6, validationMessages.maxLength({ field: "OTP", count: 6 }))
      .matches(OtpRegex, validationMessages.invalid({ field: "OTP" })),
  });

  const handlePasswordSubmit = (values: { otp: string }) => {
    console.log("Final Form Submitted:", { otp: values.otp });
    onOTPSubmit(values.otp)
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

  return (
    <div>
      <span className="font-normal text-textPrimary-250 text-sm">Secure Your Login with OTP</span>
      <div className="my-6">
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpValidation}
          onSubmit={handlePasswordSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="mb-6">
                <label className="block text-zinc-700 mb-2">OTP</label>
                <div className="flex justify-between">
                  {[0, 1, 2, 3 ,4, 5].map((index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      className="p-2 w-[35px] h-[35px] sm:w-[70px] sm:h-[60px] text-center border border-gray-300 rounded text-lg"
                      value={values.otp[index] || ""}
                      onChange={(e) => handleOtpChange(index, e, values, setFieldValue)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e, values, setFieldValue)}
                    />
                  ))}
                </div>

                <ErrorMessage
                  component="div"
                  name="otp"
                  className="text-sm text-red-500"
                />
              </div>
              <div className="flex justify-center">
                <button type="submit" className="items-center text-xl mt-4 w-[276px] h-[55px] flex justify-center bg-background-green text-white py-2 rounded hover:bg-green-700">
                  Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default OTPVerify;