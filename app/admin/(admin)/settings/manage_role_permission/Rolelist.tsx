import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaKey } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { AxiosPost } from '@/common/api/axiosService';
import { API_URLS } from '@/common/api/constants';

type Props = {
  ele: any;
  // eslint-disable-next-line no-unused-vars
  toggle: (param: any) => void;
  setPermission: any;
  open: string;
  dataLoaded: any;
};

const Rolelist = ({ ele, toggle, setPermission, open, dataLoaded }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const FetchPermissions = async (id: any) => {
    setIsLoading(true);
    dataLoaded(true);

    try {
      if (open !== id) {
        const response = await AxiosPost(`${API_URLS.SETTING.PERMISSIONS.LIST}`, {id : id});
        if (response && typeof response !== 'string' && response.statusCode === 200) {
          setPermission(response.data);
        }
      }
      setIsLoading(false);
      dataLoaded(false);
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something Went Wrong', { toastId: 'nodata', autoClose: 1000 });
      setIsLoading(false);
      dataLoaded(false);
    }
  };

  return (
    <div
      className='flex items-center justify-between w-full p-2 text-base font-medium text-left text-gray-500
    border border-b-0 border-gray-200 hover:bg-zinc-200'
      data-accordion-target={`#accordion-collapse-body-${ele.id}`}
      aria-expanded='true'
      aria-controls={`accordion-collapse-body-${ele.id}`}
    >
      <span className='text-slate-800 ps-2'>{ele.displayName}</span>

      {ele.roleName === 'Admin' ? (
        <span className='text-slate-400 font-light'>Admin permissions can not be changed</span>
      ) : (
        <button
          type='button'
          className='bg-textPrimary-green text-white mb-3 p-3 rounded-lg flex items-center'
          onClick={() => {
            toggle(ele.id);
            FetchPermissions(ele.id);
          }}
        >
          {isLoading ? (
            <span className='mr-0'>
              <CgSpinner size={20} className='animate-spin' />
            </span>
          ) : (
            <FaKey className='d-inline-block' />
          )}
          &nbsp;Permissions
        </button>
      )}
    </div>
  );
};

export default Rolelist;
