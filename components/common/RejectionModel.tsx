"use client";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

type Props = {
  toggleModal: () => void;
  onActive: (reason: string) => void;
  confirmMsg?: string;
};

const validationSchema = yup.object().shape({
  reason: yup.string().trim().required("Please provide a reason for rejection."),
});

const RejectionModel = ({ toggleModal, onActive }: Props) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto backdrop-blur-[2px] bg-opacity-40 bg-black-500">
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative animate-slide-down bg-white rounded-lg mt-[5rem] z-50">
          <div className="flex items-center justify-between p-6 rounded-t">
            <h3 className="text-lg font-semibold text-textPrimary-grey capitalize">
              General Confirmation
              <span className="text-[#FF4537] ml-2">( Reject )</span>
            </h3>
            <button
              className="w-7 h-7 rounded-md flex items-center justify-center text-textPrimary-grey"
              onClick={toggleModal}
            >
              <RxCross2 size={25} />
            </button>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-[#0000001A] via-[#000000] to-[#0000001A]"></div>

          {/* ✅ Formik Form */}
          <Formik
            initialValues={{ reason: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onActive(values.reason);
            }}
          >
            {({ touched, errors }) => (
              <Form className="p-6">
                <div className="flex flex-col justify-center">
                  <div className="mb-5">
                    <p className="text-[15px] text-textPrimary-150">Reason</p>
                    <Field
                      as="textarea"
                      name="reason"
                      className={`border w-full p-2 mt-4 rounded-md ${
                        errors.reason && touched.reason ? "border-red-500" : "border-[#4C4C5C1A]"
                      }`}
                      placeholder="Please enter reason"
                    />
                    {/* ✅ Display Validation Error */}
                    <ErrorMessage name="reason" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="flex text-center items-center justify-center space-x-4 mb-8">
                    <button
                      type="submit"
                      className="bg-background-green w-[132px] text-white text-xl px-4 py-2 rounded flex items-center justify-center gap-1 shadow"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          {/* End Formik Form */}
        </div>
      </div>
    </div>
  );
};

export default RejectionModel;
