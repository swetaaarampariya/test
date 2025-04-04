"use client";
import Link from "next/link";
import { toast } from "react-toastify";
import { Suspense, useMemo, useState } from "react";
import { ColumnT, FilterT, TableDataT } from "@/configs/common/type";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { API_URLS } from "@/common/api/constants";
import { AxiosGet } from "@/common/api/axiosService";
import { BsEyeFill } from "react-icons/bs";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { BiCheck } from "react-icons/bi";
import FilterName from "@/components/filter/FilterName";
import FilterDropdown from "@/components/filter/FilterDropdown";
import DateFilter from "@/components/filter/DateTimeInput";
import dynamic from "next/dynamic";

const CustomTable = dynamic(() => import('@/components/layout/CustomTable'), {
  loading: () => <p className="p-4 text-gray-500">Loading table...</p>,
  ssr: false,
})

const CustomerPage = () => {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const limit = searchParams.get("limit") || "10";
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const sort = searchParams.get("sort") || "";
  const sortDirection = searchParams.get("sortDirection") || "";
  const [tableFilter, setTableFilter] = useState<FilterT>({
    pageSize: 10,
    pageIndex: 1,
    sortBy: "",
    sortDirection: true,
    search: "",
    updateData: true,
  });

  const [tableData, setTableData] = useState<TableDataT<any>>({
    data: [],
    totalCount: 0,
    isSuccess: false,
    error: "",
    isLoading: true,
  });
  
  const [searchValue, setSearchValue] = useState(search);
  const [selectedRequest, setSelectedRequest] = useState("");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  console.log("date", dateRange);

  const requestTermLabels = [
    { value: "null", label: "Pending" },
    { value: "false", label: "Reject" },
    { value: "true", label: "Accept" },
  ];


  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
  
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
  
    if (dateRange?.[0] && dateRange?.[1]) {
      const startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      const endDate = moment(dateRange[1]).format("YYYY-MM-DD");
  
      params.set("startDate", startDate);
      params.set("endDate", endDate);
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }

    if (selectedRequest) {
      params.set("isFacilityManagerApproved", selectedRequest);
    } else {
      params.delete("isFacilityManagerApproved");
    }
  
    replace(`${pathname}?${params.toString()}`);
    setTimeout(() => fetchUser(), 100);
  };
  
  const fetchUser = async () => {
    let params = `page=${page}&limit=${limit}&role=Facility Manager`;
    if (search) params += `&search=${search}`;
    if (sort) params += `&sort=${sort}`;
    if (sortDirection) params += `&sortDirection=${sortDirection}`;

    if (dateRange?.[0] && dateRange?.[1]) {
      const startDate = moment(dateRange[0]).format("YYYY-MM-DD");
      const endDate = moment(dateRange[1]).format("YYYY-MM-DD");
    
      params += `&startDate=${startDate}&endDate=${endDate}`;
    }
  
    if (selectedRequest) {
      params += `&isFacilityManagerApproved=${selectedRequest}`;
    }
  
    try {
      const response = await AxiosGet(`${API_URLS.USER.LIST}?${params}`);
      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === 200
      ) {
        setTableData({
          ...tableData,
          data: response.data,
          totalCount: response.count,
          isLoading: false,
          isSuccess: true,
        });
      }
      console.log("data", response);
    } catch (error) {
      console.log("error :>> ", error);
      toast.error("Something went wrong", {
        toastId: "nodata",
        autoClose: 2000,
      });
    }
  };

  const Columns = useMemo<ColumnT[]>(
    () => [
      {
        header: "Full Name",
        name: "firstName",
        filterable: true,
        width: "30%",
        value: (cell) => (
          <span className="table-span">
            {cell.firstName ? cell.firstName : "-"}{" "}
            {cell.lastName ? cell.lastName : "-"}
          </span>
        ),
      },
      {
        header: "Email",
        name: "email",
        maxWidth: "20rem",
        filterable: true,
        value: (cell) => (
          <span className="table-span">{cell?.email ? cell?.email : "-"}</span>
        ),
      },
      {
        header: "Mobile Number",
        name: "phoneNumber",
        filterable: true,
        value: (cell) => (
          <span className="table-span capitalize">
            {cell?.phoneNumber ? cell?.phoneNumber : "-"}
          </span>
        ),
      },
      {
        header: "Specialization",
        name: "specializations",
        filterable: true,
        value: (cell) => (
          <span className="table-span capitalize">
          {cell?.specializations?.length 
            ? cell.specializations.map((spec:any) => spec.specializationName).join(", ") 
            : "-"}
        </span>
        ),
      },
      {
        header: "Action",
        name: "action",
        filterable: false,
        value: (cell) => (
          <div className="flex justify-center gap-2 items-center">
            <Link href={`/facility_manager/${cell.id}`}>
              <BsEyeFill
                size={18}
                className="duration-150 hover:scale-110 text-textPrimary-green"
              />
            </Link>
          </div>
        ),
      },
    ],
    [page, limit]
  );

  return (
    <>
      <div className="bg-slate-100 space-y-6 p-6">
        <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
          <p className="text-lg text-textPrimary-grey font-bold mb-6">
            Filters
          </p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 md:grid-cols-2">
            <Suspense>
              <FilterName
                label="Name"
                filterSearch
                placeholder="Enter Facility Manager Name"
                setSearchValue={setSearchValue}
              />
            </Suspense>

            {/* <Suspense>
              <DateTimeInput
                label="Select Date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                closeOnSelect={true}
              />
            </Suspense> */}

            {/* Date Picker (Shown only for 'Custom' Time Selection) */}

            <Suspense>
              <DateFilter
                label="Select Date Range"
                name="date-range"
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                handleDateChange={setDateRange}
                className="mb-4"
              />
            </Suspense>

            <Suspense>
            <FilterDropdown
                label="Request"
                name="isFacilityManagerApproved"
                options={requestTermLabels}
                selectedValue={selectedRequest}
                setSelectedValue={setSelectedRequest}
                placeholder="Select Request"
              />
            </Suspense>
          </div>
          <button
            className="flex bg-teal-700 text-white gap-2 hover:bg-teal-800 items-center mb-5 mt-6 px-4 py-2 transition"
            onClick={handleApplyFilters}
          >
            <BiCheck size={25} /> Apply Filters
          </button>
        </div>

        <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
          <Suspense>
            <CustomTable
              isSearch
              showRecords
              showPagination
              tableHeading="Facility manager"
              tableSubHeading="Registered User"
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
export default CustomerPage;
