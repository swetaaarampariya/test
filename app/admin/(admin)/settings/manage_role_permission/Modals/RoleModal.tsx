import * as Yup from 'yup';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg';
import { BiEditAlt } from 'react-icons/bi';
import { BsX } from 'react-icons/bs';
import { Formik, Form, Field, ErrorMessage, FormikState } from 'formik';
import { useAuth } from '@/context/AuthContext';
import { RoleListT } from '@/common/constants/type';
import ConfirmationModal from '@/components/model/ConfirmationModal';
import { AxiosDelete, AxiosPatch, AxiosPost } from '@/common/api/axiosService';
import { API_URLS } from '@/common/api/constants';

const ValidationSchema = Yup.object().shape({
  role_name: Yup.string().required('Please enter roleName'),
  display_name: Yup.string().required('Please enter display name'),
  description: Yup.string().required('Please enter description')
});

type Props = {
  toggleModal: () => void;
  GetRolesList: () => void;
  manageRoles: any;
};

type initialValueT = Yup.InferType<typeof ValidationSchema>;
type FormikHelpersType<initialValueT> = {
  // eslint-disable-next-line no-unused-vars
  resetForm: (nextState?: Partial<FormikState<initialValueT>>) => void;
  // eslint-disable-next-line no-unused-vars
  setSubmitting: (isSubmitting: boolean) => void;
};

function AddRole({ toggleModal, manageRoles, GetRolesList }: Props) {
  const { user } = useAuth();
  const [role, setRole] = useState<RoleListT | null>(null);
  const [roleId] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const initialValue = {
    role_name: role?.role_name || '',
    display_name: role?.display_name || '',
    description: role?.description || ''
  };

  const handleSubmit = async (
    values: initialValueT,
    { setSubmitting, resetForm }: FormikHelpersType<initialValueT>
  ) => {
    const param: Partial<RoleListT & initialValueT> = { ...values };

    if (role && 'id' in role) {
      param.id = role.id;
    }

    try {
      const response =
        role && Object.keys(role).length > 0
          ? await AxiosPatch(`${API_URLS.SETTING.ROLE.UPDATE}`, param)
          : await AxiosPost(`${API_URLS.SETTING.ROLE.CREATE}`, values);

      if (response && typeof response !== 'string' && response.statusCode === 200) {
        toggleModal();
        setSubmitting(false);
        resetForm();
        setRole(null);
        GetRolesList();
        toast.success(`${response.message}`, { autoClose: 2000 });
      } else {
        setSubmitting(false);
      }
    } catch (error) {
      console.log('error :>> ', error);
      toggleModal();
      setSubmitting(false);
      toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
    }
  };

  const handleDeleteRole = async () => {
    try {
      const response = await AxiosDelete(`${API_URLS.SETTING.ROLE.DELETE}/${roleId}`);
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        toast.success(response.message, { toastId: 'delete', autoClose: 2000 });
        GetRolesList();
        togglePrompt();
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 2000 });
    }
  };

  const togglePrompt = () => setShowPrompt((prev) => !prev);

  return (
    <>
      <div
        className={
          'flex justify-center z-[1000] p-4 shadow-2xl overflow-x-hidden overflow-y-auto inset-0 max-h-full backdrop-blur-[2px] bg-opacity-40 bg-black-500 fixed'
        }
      >
        <div className='relative w-full max-w-2xl max-h-full'>
          {/* Modal content */}
          <div className='relative animate-slide-down bg-white rounded-lg shadow mt-[5rem] z-50'>
            <Formik
              initialValues={initialValue}
              onSubmit={handleSubmit}
              validationSchema={ValidationSchema}
              enableReinitialize
            >
              {({ isSubmitting, resetForm }) => (
                <>
                  {/* Modal header */}
                  <div className='flex items-start justify-between p-4 border-b rounded-t '>
                    <h3 className='text-xl font-semibold text-sidebar-color '>Manage Roles</h3>
                    <button
                      type='button'
                      className='text-black transition duration-300 hover:scale-150'
                      onClick={() => {
                        setRole(null);
                        resetForm();
                        toggleModal();
                      }}
                    >
                      <BsX size={24} />
                    </button>
                  </div>
                  {/* Modal body */}
                  <Form>
                    <div className='p-6'>
                      <div className='relative overflow-x-auto mb-2'>
                        <table className='w-full text-sm text-left text-gray-500 border '>
                          <thead className='text-xs text-gray-500 uppercase bg-primary-50'>
                            <tr>
                              <th scope='col' className='px-6 py-3'>
                                #
                              </th>
                              <th scope='col' className='px-6 py-3'>
                                Roles
                              </th>
                              <th scope='col' className='px-6 py-3 text-end'>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {manageRoles?.map((role :any, index:any) => (
                              <tr key={index + 1} className='bg-white border border-b-gray-300/50 '>
                                <td className='px-6 py-2 text-slate-700 whitespace-nowrap'>{index + 1}</td>
                                <td className='px-6 py-2 text-slate-700 whitespace-nowrap'>{role?.displayName}</td>
                                <td className='px-6 py-2 text-slate-600 whitespace-nowrap text-end'>
                                  {user?.role?.roleName === role?.roleName ||
                                  role?.roleName === 'Admin' ? (
                                    <p className='text-gray-500 text-xs'>Can&apos;t change default role</p>
                                  ) : (
                                    <>
                                      <button
                                        type='button'
                                        className='btn-outline-dark p-2 rounded me-2'
                                        onClick={() => {
                                          setRole(role);
                                        }}
                                      >
                                        <BiEditAlt
                                          size={20}
                                          className='text-slate-400 transition duration-300 hover:scale-125'
                                        />
                                      </button>

                                      {/* <button
                                        type='button'
                                        className='btn-outline-dark p-2 rounded'
                                        onClick={() => {
                                          togglePrompt();
                                          setRoleId(role.id);
                                        }}
                                      >
                                        <BsTrash
                                          size={20}
                                          className='text-slate-400 transition duration-300 hover:scale-125'
                                        />
                                      </button> */}
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <hr className='mb-5' />
                      <div className='flex flex-col md:flex-row'>
                        <div className='w-full md:mr-2 mb-2'>
                          <label htmlFor='role_name' className='form-label'>
                            Role Name
                          </label>
                          <Field name='role_name' id='role_name' className='form-control py-2' placeholder='e.g. HR' />
                          <ErrorMessage component='div' name='role_name' className='text-sm text-red-500' />
                        </div>

                        <div className='w-full md:ml-2 mb-2'>
                          <label htmlFor='display_name' className='form-label'>
                            Display Name
                          </label>
                          <Field
                            name='display_name'
                            id='display_name'
                            className='form-control py-2'
                            placeholder='Display name'
                          />
                          <ErrorMessage component='div' name='display_name' className='text-sm text-red-500' />
                        </div>
                      </div>
                      <div className='flex flex-col md:flex-row'>
                        <div className='w-full'>
                          <label htmlFor='description' className='form-label'>
                            Description
                          </label>
                          <Field
                            name='description'
                            id='description'
                            className='form-control py-2'
                            placeholder='Description'
                          />
                          <ErrorMessage component='div' name='description' className='text-sm text-red-500' />
                        </div>
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className='flex justify-end items-center py-3 pr-6 space-x-3 border-t border-gray-200 rounded-b'>
                      <button
                        type='button'
                        className='btn-secondary'
                        onClick={() => {
                          setRole(null);
                          resetForm();
                          toggleModal();
                        }}
                      >
                        Cancel
                      </button>
                      <button type='submit' className='bg-textPrimary-green text-white p-2 rounded-md flex items-center' disabled={isSubmitting}>
                        {isSubmitting && <CgSpinner size={20} />} Submit
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {showPrompt && <ConfirmationModal toggleModal={togglePrompt} onActive={handleDeleteRole} />}
    </>
  );
}

export default AddRole;
