"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ColumnT, FilterT, TableDataT } from "@/configs/common/type";
import { API_URLS } from "@/common/api/constants";
import { AxiosGet } from "@/common/api/axiosService";
import { BsEyeFill } from "react-icons/bs";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const CustomTable = dynamic(() => import('@/components/layout/CustomTable'), {
  loading: () => <p className="p-4 text-gray-500">Loading table...</p>,
  ssr: false,
})

const Page = () => {
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

  useEffect(() => {
    fetchUser();
  }, [searchParams]);

  const fetchUser = async () => {
    let params = `limit=${limit}&page=${page}&role=Facility Manager&isFacilityManagerApproved=false`;
    if (search) params += `&search=${search}`;
    if (sort) params += `&sort=${sort}`;
    if (sortDirection) params += `&sortDirection=${sortDirection}`;

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
        name: "specialization",
        filterable: true,
        value: (cell) => (
          <span className="table-span capitalize">
            {cell?.specialization ? cell?.specialization : "-"}
          </span>
        ),
      },
      {
        header: "Status",
        name: "status",
        filterable: true,
        value: () => <span className="table-span capitalize">Reject</span>,
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
                className="duration-150 hover:scale-110  text-textPrimary-green"
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
          <Suspense>
            <CustomTable
              isSearch
              showRecords
              showPagination
              tableHeading="Facility manager"
              tableSubHeading="Reject User"
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
export default Page;
