import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validationMessages } from "@/common/validations/validation";
import Loading from "@/components/common/loading";

const PasswordVerify = ({ onPasswordSubmit, isLoading ,setIsLoading }: { 
  onPasswordSubmit: (password: string) => void;
  isLoading: boolean;
  setIsLoading :any
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const passwordValidation = Yup.object().shape({
    password: Yup.string()
      .min(6, validationMessages.minLength({ field: "Password", count: 6 }))
      .matches(/[A-Z]/, validationMessages.custom({ field: "Password", message: "must contain at least one uppercase letter" }))
      .matches(/[a-z]/, validationMessages.custom({ field: "Password", message: "must contain at least one lowercase letter" }))
      .matches(/\d/, validationMessages.custom({ field: "Password", message: "must contain at least one number" }))
      .matches(/[@$!%*?&]/, validationMessages.custom({ field: "Password", message: "must contain at least one special character (@, $, !, %, *, ?, &)" }))
      .required(validationMessages.required({ field: "Password" })),
  });
  

  const handlePasswordSubmit = (values: { password: string }) => {
    setIsLoading(true)
    console.log("Final Form Submitted:", { password: values.password });
    onPasswordSubmit(values.password);
  };

  return (
    <div>
      <span className="font-normal text-textPrimary-250 text-sm">Almost There! Enter Your Password</span>
      <div className="my-6">
        <Formik initialValues={{ password: "" }} validationSchema={passwordValidation} onSubmit={handlePasswordSubmit}>
          {() => (
            <Form>
              <div className="mb-4">
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 transform -translate-y-1/2 absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                  <div className="absolute bottom-[-20px] left-0 text-sm text-red-500">
                    <ErrorMessage component="div" name="password" className="text-sm text-red-500" />
                  </div>
                </div>

              </div>

              <div className="flex justify-center">
                <button type="submit"
                disabled={isLoading}
                 className="items-center text-xl mt-4 w-[276px] h-[55px] flex justify-center bg-background-green text-white py-2 rounded hover:bg-green-700">
                  {isLoading ? (  <Loading /> ) : 'Sign Up' }
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PasswordVerify;
