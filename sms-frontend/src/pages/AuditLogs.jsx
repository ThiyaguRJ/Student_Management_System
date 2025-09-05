import StudentTable from "@/components/StudentTable";
import { useAudit } from "@/hooks/useAudit";
import moment from "moment";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch } = useAudit({
    page,
    pageSize: 10,
    search,
  });

  useEffect(() => {
    refetch();
  }, [page, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading audit logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Failed to load audit logs: {error.message}
      </div>
    );
  }

  const columns = [
    { accessorKey: "entityId", header: "Entity ID" },
    { accessorKey: "action", header: "Action" },
    { accessorKey: "user", header: "User" },
    { accessorKey: "entity", header: "Entity" },
    { accessorKey: "createdAt", header: "Timestamp" },
  ];

  const exportToExcel = () => {
    if (!data?.data?.length) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      data?.data.map((row) => ({
        "Entity ID": row.entityId,
        Action: row.action,
        User: row.user,
        Entity: row.entity,
        Timestamp: moment(row.createdAt).format("DD-MM-YYYY"),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Audit.xlsx");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl mx-auto mt-3">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <StudentTable
        data={
          data?.data.map((item) => ({
            ...item,
            createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
          })) || []
        }
        total={data?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onSearch={(s) => {
          setSearch(s);
          setPage(1);
        }}
        columns={columns}
        exportToExcel={exportToExcel}
      />
    </div>
  );
}
