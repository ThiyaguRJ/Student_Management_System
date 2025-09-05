"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function StudentTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onSearch,
  columns,
  exportToExcel
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / pageSize),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(globalFilter.trim());
    }, 1000);
    return () => clearTimeout(delay);
  }, [globalFilter]);



  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* ✅ Export Button */}
        <button
          onClick={exportToExcel}
          className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data?.length ? (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey || col.id}>
                      {col.cell
                        ? col.cell({
                            row: {
                              getValue: (k) => row[k],
                              original: row,
                            },
                          })
                        : row[col.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Page {page} of {Math.ceil(total / pageSize)}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
