"use client";
import { FaPlus } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ColumnT, FilterT, TableDataT } from '@/configs/common/type';
import { API_URLS } from '@/common/api/constants';
import { AxiosGet, AxiosPatch } from '@/common/api/axiosService';
import { useSearchParams } from 'next/navigation';
import { BiSolidToggleRight, BiToggleLeft } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import dynamic from "next/dynamic";

const AddEditInterests = dynamic(() => import('@/components/AddEditInterests/page'), {
  loading: () => <p>Loading...</p>, // Optional: shows while the modal is loading
  ssr: false // Ensures it loads only on the client
});

const CustomTable = dynamic(() => import('@/components/layout/CustomTable'), {
  loading: () => <p className="p-4 text-gray-500">Loading table...</p>,
  ssr: false,
})

function InterestsMaster() {
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") || "10";
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const sortDirection = searchParams.get("sortDirection") || "";

  const [isEdit, setIsEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [designationDetail, setDesignationDetail] = useState();
  const toggleAdd = () => setShowAdd(prev => !prev);

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
    isLoading: true,
  });

  const onActive = async (id: number) => {
    try {
      const response = await AxiosPatch(
        `${API_URLS.INTERESTS.STATUS_UPDATE}/${id}`
      );
      if (response && typeof response !== 'string' && response.statusCode === 200) {
        toast.success(response.message, { toastId: 'nodata', autoClose: 2000 });
        fetchInterests()
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong', { toastId: 'nodata', autoClose: 2000 });
    }
  };

  const fetchInterests = async () => {
    let params = `limit=${limit}&page=${page}`;
    if (search) params += `&search=${search}`;
    if (sort) params += `&sort=${sort}`;
    if (sortDirection) params += `&sortDirection=${sortDirection}`;

    try {
      const response = await AxiosGet(`${API_URLS.INTERESTS.LIST}?${params}`);

      if (response && typeof response !== 'string' && response.statusCode === 200) {
        setTableData({
          ...tableData,
          data: response.data,
          totalCount: response.count,
          isLoading: false,
          isSuccess: true
        });
      }
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong', { toastId: 'nodata', autoClose: 2000 });
    }
  };
  useEffect(() => {
    fetchInterests();
  }, [searchParams, tableFilter.updateData]);

  const Columns = useMemo<ColumnT[]>(
    () => [
      {
        header: '#ID',
        name: 'id',
        filterable: true,
        width: '30%',
        value: (cell) => <span className='table-span'>{cell.id ? cell.id : '-'}</span>
      },
      {
        header: 'Interests name',
        name: 'interestName',
        maxWidth: '20rem',
        filterable: true,
        value: (cell) => <span className='table-span'>{cell?.interestName ? cell?.interestName : '-'}</span>
      },
      {
        header: "Status",
        name: "status",
        filterable: false,
        value: (cell) =>
          <div className="flex items-center ">
            {cell?.isActive
              ? (<BiSolidToggleRight size={30} className="text-textPrimary-green hover:scale-125 transition duration-500
           cursor-pointer dark:text-button-100 dark:hover:text-button-100"
                onClick={() => onActive(cell?.id)}
              />)
              : (<BiToggleLeft size={30} className="text-textPrimary-green hover:scale-125 transition duration-500 cursor-pointer
         dark:text-button-100 dark:hover:text-button-100"
                onClick={() => { onActive(cell?.id) }}
              />
              )}
          </div>
      },
      {
        header: "Action",
        width:'5%',
        name: "action",
        filterable: false,
        value: (cell) => (
          <div className="flex justify-center gap-2 items-center">
            <BsThreeDotsVertical onClick={() => handleEditClick(cell)} size={18} className="duration-150 hover:scale-110 text-textPrimary-green" />
          </div>
        ),
      },
    ],
    [page, limit]
  );

  const handleAddMore = () => {
    setIsEdit(false);
    setDesignationDetail(undefined);
    toggleAdd();
  };

  const handleEditClick = (arg: any) => {
    setDesignationDetail(arg);
    setIsEdit(true);
    toggleAdd();
  };

  return (
    <>
      <div className="bg-slate-100 space-y-6 p-6">
        <div className="flex justify-end mt-6 mb-5">
          <button className="flex bg-teal-700 text-white gap-2 hover:bg-teal-800 items-center px-4 py-2 transition"
            onClick={() => handleAddMore()}
          >
            <FaPlus />  Add Interest
          </button>
        </div>

        <div className="p-6 w-full mx-auto bg-white shadow rounded-lg">
          <Suspense>
            <CustomTable
              tableHeading="Interest"
              tableSubHeading="Interest Master"
              isSearch
              showRecords
              showPagination
              headerData={Columns}
              tableData={tableData}
              tableFilter={tableFilter}
              setTableFilter={setTableFilter}
              onFilterChange={fetchInterests}
            />
          </Suspense>
        </div>

        {showAdd && <AddEditInterests toggleModal={toggleAdd} data={designationDetail} title={isEdit}
          setTableFilter={setTableFilter} tableData={tableData} />}
      </div>
    </>
  );
}

export default InterestsMaster;
