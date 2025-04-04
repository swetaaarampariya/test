'use client';

import Link from 'next/link';
import { toast } from 'react-toastify';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ColumnT, FilterT, TableDataT } from '@/configs/common/type';
import { API_URLS } from '@/common/api/constants';
import { AxiosGet } from '@/common/api/axiosService';
import { BsEyeFill, BsThreeDotsVertical } from 'react-icons/bs';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const CustomTable = dynamic(() => import('@/components/layout/CustomTable'), {
  loading: () => <p className="p-4 text-gray-500">Loading table...</p>,
  ssr: false,
})

const TrainerList = () => {

  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") || "10";
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const sortDirection = searchParams.get("sortDirection") || "";
  const [tableFilter, setTableFilter] = useState<FilterT>({
    pageSize: 10,
    pageIndex: 1,
    sortBy: '',
    sortDirection: true,
    search: '',
    updateData: true
  });

  const [tableData, setTableData] = useState<TableDataT<any>>({
    data: [],
    totalCount: 0,
    isSuccess: false,
    error: '',
    isLoading: true
  });

  useEffect(() => {
    fetchUser();
  }, [searchParams]);

  const fetchUser = async () => {
    let params = `limit=${limit}&page=${page}&role=Trainer`;
    if (search) params += `&search=${search}`;
    if (sort) params += `&sort=${sort}`;
    if (sortDirection) params += `&sortDirection=${sortDirection}`;

    try {
      const response = await AxiosGet(`${API_URLS.USER.LIST}?${params}`);
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        setTableData({
          ...tableData,
          data: response.data,
          totalCount: response.count,
          isLoading: false,
          isSuccess: true
        });
      }
      console.log("data", response)
    } catch (error) {
      console.log('error :>> ', error);
      toast.error('Something went wrong', { toastId: 'nodata', autoClose: 2000 });
    }
  };

  const ActionDropdown = ({ traineeId }: any) => {
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => setOpen(!open);
    const closeDropdown = () => setOpen(false);

    return (
      <div className="relative">
        <button onClick={toggleDropdown} className="p-2 ">
          <BsThreeDotsVertical size={20} />
        </button>

        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={closeDropdown}
          ></div>
        )}

        {open && (
          <div className="absolute right-0 mt-2 m-2 p-2 w-[140px] hover:bg-gray-100 bg-white shadow-lg rounded-lg z-20">
            <Link
              href={`/user_management/trainer/${traineeId}`}
              className="flex items-center gap-2 p-2"
              onClick={closeDropdown}
            >
              <BsEyeFill size={18} className="text-textPrimary-green" />
              <span>View Detail</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  const Columns = useMemo<ColumnT[]>(
    () => [
      {
        header: 'Full Name',
        name: 'firstName',
        filterable: true,
        width: '30%',
        value: (cell) => (
          <span className="table-span">
            {cell.firstName ? cell.firstName : "-"}{" "}
            {cell.lastName ? cell.lastName : "-"}
          </span>
        ),
      },
      {
        header: 'Email',
        name: 'email',
        maxWidth: '20rem',
        filterable: true,
        value: (cell) => <span className='table-span'>{cell?.email ? cell?.email : '-'}</span>
      },
      {
        header: 'Mobile Number',
        name: 'phoneNumber',
        filterable: true,
        value: (cell) => <span className='table-span capitalize'>{cell?.phoneNumber ? cell?.phoneNumber : '-'}</span>
      },
      {
        header: 'User Type',
        name: 'userType',
        filterable: true,
        value: (cell) => <span className='table-span capitalize'>{cell?.userType ? cell?.userType : '-'}</span>

      },
      {
        header: "Action",
        width: '5%',
        name: "action",
        filterable: false,
        value: (cell) => <ActionDropdown traineeId={cell.id} />,
      },
    ],
    [page, limit]
  );

  return (
    <>
      <div className="bg-slate-100 space-y-6 p-6">
        {/* <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
          <p className='text-lg text-textPrimary-grey font-bold mb-6'>Filters</p>
          <div className='grid grid-cols-2 gap-10 lg:grid-cols-4 md:grid-cols-3'>
            <Suspense >

              <FilterName
                label='Name'
                onChange={handleSearch}
                placeholder='Enter Facility Manager Name'
              />

            </Suspense>

            <Suspense>
              <DateTimeInput
                label="Select Date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                closeOnSelect={true}
              />
            </Suspense>

            <Suspense>
              <UserType
                label='User Type'
                name='user_terms'
                options={userType}
                paramName='user_terms'
                placeholder='Select User Type'
              />
            </Suspense>


            <Suspense>
              <CountryName
                label='Country'
                name='country_terms'
                options={countryName}
                paramName='request_terms'
                placeholder='Select Country'
              />
            </Suspense>
          </div>
          <button className="flex bg-teal-700 text-white gap-2 hover:bg-teal-800 items-center mb-5 mt-6 px-4 py-2 transition">
            <BiCheck size={25} /> Apply Filters
          </button>
        </div> */}

        <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
          <Suspense>
            <CustomTable
              isSearch
              showRecords
              showPagination
              tableHeading='Trainer'
              tableSubHeading='Registered User'
              headerData={Columns}
              tableData={tableData}
              tableFilter={tableFilter}
              setTableFilter={setTableFilter}
              onFilterChange={fetchUser}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
};
export default TrainerList;
