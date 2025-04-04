'use client';
import { BsSortDownAlt, BsSortUpAlt } from 'react-icons/bs';
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { ColumnT, FilterT, TableDataT } from '@/configs/common/type';
import debounce from 'lodash/debounce';
import { RiSearch2Line } from 'react-icons/ri';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';
import { MdArrowForwardIos } from 'react-icons/md';
import { IoChevronBack } from 'react-icons/io5';

type Props = {
  headerData: ColumnT[];
  tableFilter: FilterT;
  tableData: TableDataT;
  setTableFilter?: Dispatch<SetStateAction<FilterT>>;
  tableHeading?: string;
  tableSubHeading?:string;
  exportData?: boolean;
  showRecords?: boolean;
  isSearch?: boolean;
  addBtnText?: string;
  showPagination?: boolean;
  addBtnAction?: () => void;
  exportFunction?: () => void;
  onFilterChange: () => void;
  isAccordian?: boolean;
  openAccordianId?: number | null;
  accrodianComponent?: ReactNode;
};

const CustomTable = ({
  headerData,
  tableData,
  tableHeading,
  tableSubHeading,
  exportData,
  exportFunction,
  isSearch = false,
  addBtnText,
  addBtnAction,
  showPagination = false,
  onFilterChange,
  isAccordian = false,
  openAccordianId,
  accrodianComponent
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [limit] = useState(searchParams.get('limit') || '10');
  const [page, setPage] = useState(searchParams.get('page') || '1');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || '');

  const { data, isLoading, error, totalCount } = tableData;


  {/* For startIndex and EndIndex*/}
  const calculatedStartIndex = (Number(page) - 1) * Number(limit) + 1;
  const calculatedEndIndex = Math.min(Number(page) * Number(limit), totalCount);


  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get('limit')) params.set('limit', '10');
    if (!params.get('page')) params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
    onFilterChange();
  }, []);

  const handlePagination = (value?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('page', value.toString());
      setPage(value.toString());
      replace(`${pathname}?${params.toString()}`);
      // onFilterChange(params);
    }
  };



  const handleDebouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      replace(`${pathname}?${params.toString()}`);
      // onFilterChange(params);
    }, 1000), // Debounce delay
    [searchParams, pathname, replace]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearch(value); // Update state immediately for smooth typing
    handleDebouncedSearch(value); // Debounced URL update
  };

  const handleSort = (value?: any) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value.name);
      params.set('sortDirection', sortDirection === '1' ? '-1' : '1');
      setSort(value.name);
      setSortDirection(sortDirection === '1' ? '-1' : '1');
    }
    replace(`${pathname}?${params.toString()}`);
    // onFilterChange(params);
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return (
      <div className="relative overflow-x-auto w-full">
        <table className="w-full text-sm text-left rtl:text-right border border-slate-200 rounded-md">
          <thead className="text-textPrimary-primary font-normal capitalize bg-background-green h-10 leading-6">
            <tr>
              {headerData?.map((_, index) => (
                <th key={index} className="px-6 font-semibold text-nowrap">
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-200 text-sm text-textPrimary-250 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-background-primary'
                }`}
              >
                {headerData?.map((_, i) => (
                  <td key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } 

  return (
    <>
      {tableHeading && <div className='font-bold text-[25px] uppercase text-textPrimary-grey mb-6 '>{tableHeading}</div>}
      <div className='w-full border mt-10 border-dashed rounded-lg py-6 '>
        <div className='w-full flex justify-between items-center'>

          {exportData && (
            <button
              className='uppercase btn-primary px-4 text-sm md:text-base'
              onClick={() => exportFunction && exportFunction()}
            >
              Export
            </button>
          )}
        </div>

        <div className="flex w-full justify-between items-center flex-wrap gap-4 my-5 px-4">
          <p className="text-textPrimary-150 text-base font-semibold"> {tableSubHeading}  <span className="text-textPrimary-250 ml-2">( Total Result : {totalCount} )</span></p>
          {isSearch && (
            <div className="relative">
              <input
                value={search}
                onChange={handleInputChange}
                placeholder="Search"
                className="form-control py-2 w-full sm:w-[250px] pr-10"
              />
              <RiSearch2Line className="absolute text-2xl right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          )}
          {addBtnText && (
            <button className="btn-primary" onClick={addBtnAction}>
              {addBtnText}
            </button>
          )}
        </div>

        <hr className='h-1 my-4 border-slate-300' />

        <div className='relative overflow-x-auto w-full'>
          <table className='w-full text-sm text-left rtl:text-right border border-slate-200 rounded-md'>
            <thead className=' text-textPrimary-primary font-normal capitalize bg-background-green h-10 leading-6'>
              <tr>
                {headerData?.map((data, index) => (
                  <th
                    scope='col'
                    className='px-6 font-semibold text-nowrap'
                    key={`${data.name!} + ${index}`}
                    style={{ width: data?.width, maxWidth: data?.maxWidth }}
                    onClick={() => {
                      if (data?.filterable === true) {
                        handleSort(data);
                      }
                    }}
                  >
                    {data.header!}
                    {data?.filterable === true && (
                      <span className='cursor-pointer ml-1'>
                        {sort === data?.name && sortDirection === 'ASC' ? (
                          <BsSortDownAlt className='inline-block' />
                        ) : (
                          <BsSortUpAlt className='inline-block' />
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data?.map((data, idx) => (
                  <React.Fragment key={idx}>
                    <tr
                      className={`border-b border-slate-200 text-sm text-textPrimary-250 ${idx % 2 === 0 ? 'bg-white' : 'bg-background-primary'
                        }`}
                    >
                      {headerData?.map((item, i) => (
                        <td className='px-6 py-3' key={i}>
                          {item.value(data, idx)}
                        </td>
                      ))}
                    </tr>
                    {isAccordian && (
                      <tr>
                        <td colSpan={headerData.length}>
                          {openAccordianId === idx && <div>{accrodianComponent}</div>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={headerData?.length} className='px-3 py-2 text-center h-12'>
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-2 px-3">
          <p className=" text-textPrimary-150 text-base ">
            Showing <span className="font-medium">{calculatedStartIndex}</span> to <span className="font-medium">{calculatedEndIndex}</span> of <span className="font-medium">{totalCount}</span> entries
            {/* Showing <span className="font-medium">1</span> To <span className="font-medium">10</span> Of <span className="font-medium">57</span> Entries */}
          </p>
          {showPagination && data.length > 0 && (
            <div className='flex flex-wrap md:justify-end justify-center items-center mr-0 mt-4 '>
              <div className='md:flex-[0_0_auto] md:w-auto'>
                <div className='flex'>
                  <button
                    type='button'
                    onClick={() => handlePagination(1)}
                    disabled={page === '1' ? true : false}
                    // className='bg-gray-500 text-xs md:px-4 py-2 px-3 rounded text-white mr-1 disabled:cursor-not-allowed disabled:bg-gray-400'
                    className="px-3 py-2 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* {'<<'} */}
                    <RxDoubleArrowLeft size={20} />

                  </button>
                  <button
                    type='button'
                    onClick={() => handlePagination(Number(page) - 1)}
                    disabled={page === '1' ? true : false}
                    // className='bg-gray-500 text-xs md:px-4 py-2 px-3 rounded text-white mr-1 disabled:cursor-not-allowed disabled:bg-gray-400'
                    className="px-3 py-2 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"

                  >
                    {/* {'<'} */}
                    <IoChevronBack size={15} />
                  </button>
                </div>
              </div>
               <div className="flex space-x-2">
                {[...Array(Math.ceil(totalCount / Number(limit)))].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePagination(pageNumber)}
                      className={`px-3 py-2 rounded ${pageNumber === Number(page) ? 'bg-background-green text-white' : ''
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <div className='md:flex-[0_0_auto] md:w-auto'>
                <div className='flex'>
                  <button
                    type='button'
                    onClick={() => handlePagination(Number(page) + 1)}
                    disabled={totalCount === 0 || page === Math.ceil(totalCount / Number(limit)).toString() ? true : false}
                    className="px-3 py-2 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"

                  >
                    <MdArrowForwardIos size={15} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handlePagination(Math.ceil(totalCount / Number(limit)))}
                    disabled={totalCount === 0 || page === Math.ceil(totalCount / Number(limit)).toString() ? true : false}
                    className="px-3 py-2 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RxDoubleArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomTable;
