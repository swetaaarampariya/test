import { toast } from 'react-toastify';
import { Fragment, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { AxiosPost } from '@/common/api/axiosService';
import { API_URLS } from '@/common/api/constants';


type Props = {
  roleId?: number;
  // eslint-disable-next-line
  FetchPermissions: (roleId: number) => void;
  permission: any;
  role: string;
  params: {
    id: string;
  };
};

function AdminPermissions({ permission, roleId = 1, FetchPermissions, role, params }: Props) {
  const [currentab, setCurrentTab] = useState<{ [key: string]: number }>({});
  const [subModuleTab, setSubModuleTab] = useState<{ [key: string]: number }>({});

  const HandleChange = async (e: any, moduleId: any, permissionId: any) => {
    if (role === 'user') {
      try {
        const data = {
          roleId: roleId,
          moduleId: moduleId,
          permissionId: permissionId,
          permissionTypeId: e.target.value
        };

        const response = await AxiosPost(`${API_URLS.SETTING.PERMISSIONS.CREATE}`, data);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          toast.success(response.message, { autoClose: 1000, toastId: 'success' });
          FetchPermissions(roleId);
        }
      } catch (error) {
        console.log('error :>> ', error);
        toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
      }
    } else {
      try {
        const data = {
          crm_user_id: params.id,
          module_id: moduleId,
          permission_id: permissionId,
          permission_type_id: e.target.value
        };

        const response = await AxiosPost(`${API_URLS.AUTH.PERMISSION_LIST}`, data);
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          toast.success(response.message, { autoClose: 1000, toastId: 'success' });
          FetchPermissions(parseInt(params.id));
        }
      } catch (error) {
        console.log('error :>> ', error);
        toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
      }
    }
  };

  const GenerateTableData = (item: any, operation: any) => {
    let viewPermissionOptions = null;
    if (item.permissionList?.length > 0) {
      for (const permission of item.permissionList) {
        if (permission.actionType === operation && permission.allowedPermission?.length > 0) {
          viewPermissionOptions = (
            <select
              key={item.id}
              onChange={(e) => HandleChange(e, item.id, permission.id)}
              value={permission?.allowedPermission?.find((option: any) => option.isSelected)?.id}
              className='form-control p-2'
            >
              {permission?.allowedPermission?.map((allowed: any, i: number) => (
                <option key={i} value={allowed?.id}>
                  {allowed.name}
                </option>
              ))}
            </select>
          );
          break;
        }
      }
    }

    return <td className='px-6 py-2'>{viewPermissionOptions ? viewPermissionOptions : '--'}</td>;
  };

  return (
    <>
      <table className='w-full text-sm text-left text-gray-500 border'>
        <thead className='text-xs text-black-500 uppercase bg-slate-200'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Module
            </th>
            <th scope='col' className='px-6 py-3'>
              View
            </th>
            <th scope='col' className='px-6 py-3'>
              Create
            </th>
            <th scope='col' className='px-6 py-3'>
              Update
            </th>
            <th scope='col' className='px-6 py-3'>
            DELETE
            </th>
            <th scope='col' className='px-6 py-3'></th>
          </tr>
        </thead>
        <tbody>
          {console.log('permission :>> ', permission)}
          {permission?.length > 0
            ? permission.map((module: any, index: number) => (
              <Fragment key={module.id}>
                <tr className='bg-white border border-b-gray-300/50'>
                  <td className='px-6 py-2'>
                    <span>{module?.displayName}</span>
                  </td>
                  {GenerateTableData(module, 'VIEW')}
                  {GenerateTableData(module, 'CREATE')}
                  {GenerateTableData(module, 'UPDATE')}
                  {GenerateTableData(module, 'DELETE')}

                  <td className='border-0 border-start'>
                    {module?.subModule?.length > 0 && (
                      <button
                        type='button'
                        className='text-secondary focus:outline-none font-medium rounded text-sm me-3 py-3 px-5 text-center inline-flex items-center'
                        onClick={() =>
                          setCurrentTab((prevTabs) => {
                            const updatedTabs = { ...prevTabs };
                            const newKey = index + 1;
                            // If the key already exists, delete it
                            if (updatedTabs[newKey] !== undefined) delete updatedTabs[newKey];
                            else updatedTabs[newKey] = newKey;
                            return updatedTabs;
                          })
                        }
                      >
                        {currentab[index + 1] ? (
                          <>
                            Less <BiChevronUp className='inline-block' />
                          </>
                        ) : (
                          <>
                            More <BiChevronDown className='inline-block' />
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
                {module?.subModule?.length > 0 ? (
                  <tr>
                    <td colSpan={6} className='py-0 border-0 px-6'>
                      <div className={`ms-auto ${currentab[index + 1] ? '' : 'hidden'}`}>
                        <table className='w-full text-sm text-left text-gray-500 border-1'>
                          <thead className='text-xs text-black-500 uppercase bg-slate-200'>
                            <tr>
                              <th scope='col' className='px-6 py-3'>
                                SubModule
                              </th>
                              <th scope='col' className='px-6 py-3'>
                                View
                              </th>
                              <th scope='col' className='px-6 py-3'>
                                Create
                              </th>
                              <th scope='col' className='px-6 py-3'>
                                Update
                              </th>
                              <th scope='col' className='px-6 py-3'>
                              DELETE
                              </th>
                              <th scope='col' className='px-6 py-3'></th>
                            </tr>
                          </thead>
                          <tbody>
                            {module?.subModule?.map((submodule: any, subIndex: number) => (
                              <Fragment key={submodule.id}>
                                <tr className='text-black'>
                                  <td className='px-6 py-2'>{submodule?.displayName}</td>
                                  {GenerateTableData(submodule, 'VIEW')}
                                  {GenerateTableData(submodule, 'CREATE')}
                                  {GenerateTableData(submodule, 'UPDATE')}
                                  {GenerateTableData(submodule, 'DELETE')}
                                  <td className='border-0 border-start'>
                                    {submodule?.subModule?.length > 0 && (
                                      <button
                                        type='button'
                                        className='text-secondary focus:outline-none font-medium rounded text-sm me-3 py-3 px-5 text-center inline-flex items-center'
                                        onClick={() =>
                                          setSubModuleTab((prevTabs) => {
                                            const updatedTabs = { ...prevTabs };
                                            const newKey = `${index}_${subIndex}`;
                                            // If the key already exists, delete it
                                            if (updatedTabs[newKey] !== undefined) delete updatedTabs[newKey];
                                            else updatedTabs[newKey] = 1;
                                            return updatedTabs;
                                          })
                                        }
                                      >
                                        {subModuleTab[`${index}_${subIndex}`] ? (
                                          <>
                                            Less <BiChevronUp className='inline-block' />
                                          </>
                                        ) : (
                                          <>
                                            More <BiChevronDown className='inline-block' />
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                                {submodule?.subModule?.length > 0 ? (
                                  <tr>
                                    <td colSpan={5} className='py-0 border-0 px-6'>
                                      <div
                                        className={`ms-auto ${subModuleTab[`${index}_${subIndex}`] ? '' : 'hidden'}`}
                                      >
                                        <table className='w-full text-sm text-left text-gray-500 border-1'>
                                          <thead className='text-xs text-black-500 uppercase bg-slate-200'>
                                            <tr>
                                              <th scope='col' className='px-6 py-3'>
                                                Nested SubModule
                                              </th>
                                              <th scope='col' className='px-6 py-3'>
                                                View
                                              </th>
                                              <th scope='col' className='px-6 py-3'>
                                                Update
                                              </th>
                                              <th scope='col' className='px-6 py-3'>
                                                Active / Deactive
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {submodule?.subModule?.map((nestedSubmodule: any) => (
                                              <tr key={nestedSubmodule.id} className='text-black'>
                                                <td className='px-6 py-2'>{nestedSubmodule?.displayName}</td>
                                                {GenerateTableData(nestedSubmodule, 'VIEW')}
                                                {GenerateTableData(nestedSubmodule, 'UPDATE')}
                                                {GenerateTableData(nestedSubmodule, 'ACTIVE')}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))
            : null}
        </tbody>
      </table>
    </>
  );
}

export default AdminPermissions;
