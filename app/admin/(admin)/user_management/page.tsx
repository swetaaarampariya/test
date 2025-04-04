"use client";
import { toast } from "react-toastify";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ColumnT, FilterT, TableDataT } from "@/configs/common/type";
import { API_URLS } from "@/common/api/constants";
import { AxiosGet } from "@/common/api/axiosService";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { BiCheck } from "react-icons/bi";
import FilterName from "@/components/filter/FilterName";
import DateFilter from "@/components/filter/DateTimeInput";
import UserType from "@/components/filter/UserType";
import CountryName from "@/components/filter/CountryName";
import dynamic from "next/dynamic";

const CustomTable = dynamic(() => import('@/components/layout/CustomTable'), {
  loading: () => <p className="p-4 text-gray-500">Loading table...</p>,
  ssr: false,
})

const UserManagement = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
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
  const [selectedCountry, setSelectedCountry] = useState("");
  const userTypes = [
    { value: "Trainer", label: "Trainer" },
    { value: "Trainee", label: "Trainee" },
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
      params.set("role", selectedRequest);
    } else {
      params.set("role", "Trainer,Trainee");
    }

    if (selectedCountry) {
      params.set("country", selectedCountry);
    } else {
      params.delete("country");
    }

    replace(`${pathname}?${params.toString()}`);
  
    setTimeout(() => fetchUser(), 100);
  };
  useEffect(() => {
    fetchUser();
  }, [searchParams]);

  const fetchUser = async () => {
    const params = new URLSearchParams(searchParams.toString()); // Extract updated filters from the URL
  
    let query = `limit=${limit}&page=${page}`;
  
    if (params.get("search")) query += `&search=${params.get("search")}`;
    if (params.get("sort")) query += `&sort=${params.get("sort")}`;
    if (params.get("sortDirection")) query += `&sortDirection=${params.get("sortDirection")}`;
    if (params.get("startDate") && params.get("endDate")) {
      query += `&startDate=${params.get("startDate")}&endDate=${params.get("endDate")}`;
    }
    if (params.get("role")) {
      query += `&role=${params.get("role")}`;
    } else {
      query += `&role=Trainer,Trainee`; // Default roles if not set
    }
  
    if (params.get("country")) {
      query += `&country=${params.get("country")}`;
    }
  
    try {
      const response = await AxiosGet(`${API_URLS.USER.LIST}?${query}`);
      if (response && typeof response !== "string" && response.statusCode === 200) {
        setTableData({
          ...tableData,
          data: response.data,
          totalCount: response.count,
          isLoading: false,
          isSuccess: true,
        });
      }
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
        header: "User Type",
        name: "userType",
        filterable: true,
        value: (cell) => (
          <span className="table-span capitalize">
            {cell?.userType ? cell?.userType : "-"}
          </span>
        ),
      },
    ],
    [page, limit]
  );

  useEffect(() => {
    replace(`${pathname}`);
    fetchUser();
  }, []);

  return (
    <>
      <div className="bg-slate-100 space-y-6 p-6">
        <div className="bg-white border-gray-200 border-none p-6 rounded-lg shadow-md">
          <p className="text-lg text-textPrimary-grey font-bold mb-6">
            Filters
          </p>
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 md:grid-cols-3">
            <Suspense>
              <FilterName
                label="User Name"
                filterSearch
                placeholder="Enter User name"
                setSearchValue={setSearchValue}
              />
            </Suspense>
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
              <UserType
                label="User Type"
                name="roleName"
                options={userTypes}
                selectedValue={selectedRequest}
                setSelectedValue={setSelectedRequest}
                placeholder="Select User Type"
              />
            </Suspense>
            <Suspense>
              <CountryName
                label="Country"
                name="country_terms"
                selectedValue={selectedCountry} 
                setSelectedValue={setSelectedCountry} 
                placeholder="Select Country"
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
              tableHeading="User Management"
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
export default UserManagement;
