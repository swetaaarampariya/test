'use client';

import { toast } from 'react-toastify';
import { CgSpinner } from 'react-icons/cg';
import { FaUsersCog } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

//importing some required components
import Rolelist from './Rolelist';
import AddRole from './Modals/RoleModal';
import AdminPermissions from './AdminPermissions';
import { AxiosGet, AxiosPost } from '@/common/api/axiosService';
import { API_URLS } from '@/common/api/constants';

type Props = {
  params: {
    id: string;
  };
};

function RolesAndPermissions({ params }: any) {
  const [open, setOpen] = useState('');
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manageRoles, setManageRoles] = useState([]);

  useEffect(() => {
    GetRolesList();
  }, []);

  const GetRolesList = async () => {
    try {
      const response = await AxiosGet(`${API_URLS.SETTING.ROLE.LIST}`);
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        setManageRoles(response.data);
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
    }
  };

  const toggle = (id: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    open === id ? setOpen('') : setOpen(id);
  };

  const toggleModal = () => setShow((prev) => !prev);

  const FetchPermissions = async (id: number) => {
    try {
      const response = await AxiosPost(`${API_URLS.SETTING.PERMISSIONS.LIST}`, {id});
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        setPermission(response.data);
      }
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
    }
  };

  return (
    <>
     <div className="bg-slate-100 space-y-6 p-6">
     <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
        <div className='flex justify-between'>
          <h1 className='font-bold text-xl'>Roles & Permissions</h1>
          <button type='button' className='bg-textPrimary-green text-white mb-3 p-4 rounded-lg' onClick={() => toggleModal()}>
            <FaUsersCog className='inline-block' />
            &nbsp;Manage Role
          </button>
        </div>
        <hr className='border border-gray-50 my-3' />
        <div>
          <div
            id='accordion-collapse'
            data-accordion='collapse'
            className={`${manageRoles?.length > 0 ? 'last:border-b' : ''}`}
          >
            {manageRoles?.length > 0 ? (
              manageRoles.map((ele: any, index) => (
                <React.Fragment key={index + 1}>
                  <h6 id={`accordion-collapse-heading-${ele.id}`} className=''>
                    <Rolelist
                      ele={ele}
                      setPermission={setPermission}
                      toggle={toggle}
                      open={open}
                      dataLoaded={setIsLoading}
                    />
                  </h6>
                  <div
                    id={`accordion-collapse-body-${ele.id}`}
                    className={open === ele.id ? 'show' : 'hidden'}
                    aria-labelledby={`accordion-collapse-heading-${ele.id}`}
                  >
                    <div className='border border-b-0 border-gray-200'>
                      {isLoading ? (
                        <div className='w-full flex justify-center items-center h-7'>
                          <CgSpinner size={20} className='animate-spin' /> Loading...
                        </div>
                      ) : (
                        <AdminPermissions
                          permission={permission}
                          roleId={ele.id}
                          FetchPermissions={FetchPermissions}
                          role={'user'}
                          params={params}
                        />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className='text-center'>No Roles & Permission Found</div>
            )}
          </div>
        </div>
      </div>
      {show && <AddRole toggleModal={toggleModal} manageRoles={manageRoles} GetRolesList={GetRolesList} />}
      </div>
    </>
  );
}

export default RolesAndPermissions;
