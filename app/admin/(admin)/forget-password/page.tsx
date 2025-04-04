"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const Login = () => {
    const EmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    const ValidationSchema = Yup.object().shape({
        emailOrMobile: Yup.string()
            .required("Please enter your email")
            .test(
                "email-or-mobile",
                "Enter a valid email",
                (value) => EmailRegex.test(value)
            ),
    });

    const handleSubmit = () => { };

    return (
        <div className="flex items-center justify-center min-h-[80vh] h-[100vh] bg-[linear-gradient(180deg,_#9FCF5E52_0%,_#2BAFEA4A_100%)]">
            <div className="p-8 rounded-lg shadow-xl w-full max-w-md border border-green-200 bg-white">
                <h2 className="text-2xl font-bold text-left mb-2">Forget password</h2>
                <p className="text-sm text-left mb-2">
                    Enter the email address associated with your account and we&apos;ll
                    send you a link to reset your password.
                </p>
                <div className="mb-6">
                    <Formik
                        initialValues={{ emailOrMobile: "", password: "", otp: "" }}
                        validationSchema={ValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, handleChange }) => {
                            return (
                                <Form>
                                    <div className="my-4">
                                        <label
                                            htmlFor="emailOrMobile"
                                            className="block text-zinc-700 mb-2"
                                        >
                                            Email ID
                                        </label>
                                        <Field
                                            type="text"
                                            className="form-control p-2 w-full"
                                            id="emailOrMobile"
                                            placeholder="Enter email or mobile number"
                                            name="emailOrMobile"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                handleChange(e);
                                            }}
                                        />
                                        <ErrorMessage
                                            component="div"
                                            name="emailOrMobile"
                                            className="text-sm text-red-500"
                                        />
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Send
                                    </button>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Login;
