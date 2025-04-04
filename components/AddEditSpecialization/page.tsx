import { FC } from "react";
import { toast } from "react-toastify";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { IoCloseSharp } from "react-icons/io5";
import useWidth from "@/configs/common/useWidth";
import { AxiosPatch, AxiosPost } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import * as Yup from 'yup';
import { AddEditSpecializationProps } from "@/common/constants/interface";

const AddEditSpecialization: FC<AddEditSpecializationProps> = ({ toggleModal, title, collapsed, data, setTableFilter, tableData }) => {
  const { width, breakpoints } = useWidth();

  const switchHeaderClass = () => {
    if (collapsed) {
      return 'ltr:ml-[72px] rtl:mr-[72px]';
    } else {
      return 'ltr:ml-[248px] rtl:mr-[248px]';
    }
  };

  const handleSubmit = async (values: { specializationName: string }, { resetForm, setSubmitting }: any) => {
    try {
      const payload = { id: data?.id, specializationName: values?.specializationName };

      const response = title
        ? await AxiosPatch(`${API_URLS.SPECIALIZATION.UPDATE}`, payload)
        : await AxiosPost(`${API_URLS.SPECIALIZATION.ADD}`, payload);

      if (response && typeof response !== 'string' && (response.statusCode === 200 || response.statusCode === 201)) {
        setSubmitting(false);
        resetForm();
        toggleModal();
        setTableFilter((prev:any) => ({ ...prev, updateData: !prev.updateData }));
        toast.success(`${response.message}`, { autoClose: 2000 });
      }
    } catch (error) {
      console.log('error', error)
      setSubmitting(false);
      toast.error("Something Went Wrong", { toastId: "nodata", autoClose: 1000 });
    }
  };

  const existingSpecializationName = tableData?.data?.map((item:any) => item.specializationName) || [];

  const SpecializationValidation = Yup.object().shape({
    specializationName: Yup.string()
      .required('Specialization name is required')
      .max(100, 'Specialization name cannot exceed 100 characters')
      .test(
        'unique-specializationName',
        'This Specialization name already exists',
        (value) => {
          if (data?.id && value === data?.specializationName) {
            return true;
          }
          if (value && !existingSpecializationName.includes(value)) {
            return true;
          }
        }
      ),
  });

  return (
    <div
      className={`flex items-center justify-center z-[1000] p-4 overflow-x-hidden overflow-y-auto inset-0 h-[calc(100%-1rem)] max-h-full absolute backdrop-blur-[1px] bg-opacity-40 bg-black-500 ${(width ?? 0) > breakpoints.lg ? switchHeaderClass() : ""} h-screen`}
    >
      <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative animate-slide-down bg-white rounded-lg shadow dark:bg-gray-700 mt-[5rem] z-50">
          <Formik
            initialValues={{ specializationName: data?.specializationName || "" }}
            validationSchema={SpecializationValidation}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <div className="flex items-start justify-between p-4  rounded-t dark:border-gray-600">
                  <h3 className="font-semibold text-[15px] text-textPrimary-grey dark:text-white uppercase">{title ? "Edit Specialization" : "Add Specialization"}</h3>
                  <IoCloseSharp
                    size={30}
                    className="cursor-pointer text-title dark:text-slate-300"
                    onClick={() => {
                      resetForm();
                      toggleModal();
                    }}
                  />
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-[#0000001A] via-[#000000] to-[#0000001A]"></div>
                <div className="p-6">
                  <div className="grid md:grid-cols-4 grid-cols-12 gap-5">
                    <div className="w-full mb-2 col-span-12">
                      <div className="mb-6 relative">
                        <Field
                          type="text"
                          id="specializationName"
                          name="specializationName"
                          className="input border p-2 rounded-md w-full focus:outline-none peer"
                          placeholder=" "
                        />
                        <label
                          htmlFor="specializationName"
                          className="absolute left-3 text-gray-500 transition-all
             peer-placeholder-shown:translate-y-4 peer-placeholder-shown:text-base
             peer-focus:translate-y-[-50%] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1
             peer-disabled:translate-y-[-50%] peer-disabled:scale-75 peer-disabled:bg-[#fff] peer-disabled:px-1"
                        >
                          Specialization Name
                        </label>
                        <ErrorMessage component="div" name="specializationName" className="text-red-500 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center py-10">
                  <button type='submit' className="bg-background-green w-[132px] text-white text-xl px-4 py-2 rounded flex items-center justify-center gap-1 shadow " disabled={isSubmitting}>
                    {title ? "Update" : "Submit"}
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

export default AddEditSpecialization;
