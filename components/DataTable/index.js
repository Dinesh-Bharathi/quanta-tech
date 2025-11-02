"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Search,
  Grid3x3,
  List,
  Filter,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import * as XLSX from "xlsx";

// Map column keys to their display labels
const FILTER_LABELS = {
  is_active: {
    1: "Active",
    0: "Inactive",
    true: "Active",
    false: "Inactive",
  },
};

const DataTable = ({
  columns,
  rows,
  globalFilterFn,
  onDataTableSearch,
  searchplaceholder,
  filterColumns = [],
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilterValues, setColumnFilterValues] = useState({});
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dataTableViewMode") || "table";
    }
    return "table";
  });

  const [searchQuery, setSearchQuery] = useState({});
  const [openFilter, setOpenFilter] = useState(null);

  const handleFilterPopoverToggle = (columnKey) => {
    setOpenFilter((prev) => (prev === columnKey ? null : columnKey));
  };

  const handleSearchChange = (columnKey, value) => {
    setSearchQuery((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("dataTableViewMode", mode);
    }
  };

  const handleFilterChange = (value) => {
    setGlobalFilter(value);
    if (onDataTableSearch) {
      onDataTableSearch(value);
    }
  };

  const getUniqueColumnValues = (rows, columnKey) => {
    const values = rows
      .map((row) => String(row[columnKey]))
      .filter((v) => v !== "null" && v !== "undefined" && v !== "");
    return [...new Set(values)].sort();
  };

  const filterOptionsMap = useMemo(() => {
    const optionsMap = {};
    filterColumns.forEach((columnKey) => {
      optionsMap[columnKey] = getUniqueColumnValues(rows, columnKey);
    });
    return optionsMap;
  }, [rows, filterColumns]);

  const filteredOptions = useMemo(() => {
    const map = {};
    filterColumns.forEach((columnKey) => {
      const query = (searchQuery[columnKey] || "").toLowerCase();
      const options = filterOptionsMap[columnKey] || [];
      map[columnKey] = query
        ? options.filter((opt) => opt.toLowerCase().includes(query))
        : options;
    });
    return map;
  }, [filterOptionsMap, searchQuery]);

  const handleColumnFilterChange = (columnKey, value, checked) => {
    setColumnFilterValues((prev) => {
      const currentFilters = prev[columnKey] || [];
      if (checked) {
        return {
          ...prev,
          [columnKey]: [...currentFilters, value],
        };
      } else {
        return {
          ...prev,
          [columnKey]: currentFilters.filter((v) => v !== value),
        };
      }
    });
  };

  const handleClearColumnFilter = (columnKey) => {
    setColumnFilterValues((prev) => ({
      ...prev,
      [columnKey]: [],
    }));
  };

  const customFilterFn = useCallback(
    (row) => {
      const hasActiveFilters = Object.values(columnFilterValues).some(
        (filters) => filters.length > 0
      );

      if (!hasActiveFilters) return true;

      return Object.entries(columnFilterValues).every(
        ([columnKey, selectedValues]) => {
          if (selectedValues.length === 0) return true;
          const cellValue = row.original
            ? row.original[columnKey]
            : row[columnKey];
          return selectedValues.includes(cellValue);
        }
      );
    },
    [columnFilterValues]
  );

  const filteredRowsByColumnFilter = useMemo(() => {
    return rows.filter(customFilterFn);
  }, [rows, columnFilterValues]);

  const optionCounts = useMemo(() => {
    const counts = {};
    filterColumns.forEach((columnKey) => {
      const map = {};
      rows.forEach((r) => {
        const raw = r[columnKey];
        const key = String(raw); // normalize to string to match filterOptionsMap
        map[key] = (map[key] || 0) + 1;
      });
      counts[columnKey] = map;
    });
    return counts;
  }, [rows, filterColumns]);

  const table = useReactTable({
    data: filteredRowsByColumnFilter,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    onGlobalFilterChange: handleFilterChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Generate export data for currently visible columns (excluding "actions")
  const getVisibleData = () => {
    const visibleCols = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "actions" &&
          (col.accessorKey || typeof col.accessorFn === "function")
      )
      .map((col) => ({
        key: col.accessorKey,
        header: col.columnDef.headerName || col.id,
        accessorFn: col.accessorFn,
      }));

    const exportData = table.getFilteredRowModel().rows.map((row) => {
      const obj = {};

      visibleCols.forEach(({ key, header, accessorFn }) => {
        let value = key ? row.original?.[key] : accessorFn?.(row.original);

        // ✅ Handle boolean/numeric fields like is_active properly
        if (key === "is_active") {
          const normalized = value === true || value === 1 ? true : false;
          value = normalized ? "Active" : "Inactive";
        }

        // ✅ Also apply FILTER_LABELS if present
        if (FILTER_LABELS?.[key]) {
          const labelMap = FILTER_LABELS[key];
          // normalize the key to string, number, or boolean
          const lookupKey =
            typeof value === "boolean"
              ? value
              : value === 1
              ? true
              : value === 0
              ? false
              : value;
          value = labelMap[lookupKey] ?? value;
        }

        // ✅ Format date fields nicely (optional)
        if (key === "created_at" && value) {
          value = new Date(value).toLocaleDateString();
        }

        obj[header] = value ?? "";
      });

      return obj;
    });

    return { visibleCols, exportData };
  };

  // Export as CSV
  const exportToCSV = () => {
    const { exportData } = getVisibleData();
    if (!exportData.length) return alert("No data to export!");

    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(","),
      ...exportData.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "table_data.csv";
    link.click();
  };

  // Export as Excel
  const exportToExcel = () => {
    const { exportData } = getVisibleData();
    if (!exportData.length) return alert("No data to export!");

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  const renderCardView = () => {
    return (
      <div
        className="overflow-y-auto max-h-[400px] px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const roleData = row.original;
              const actionCell = row
                .getVisibleCells()
                .find((cell) => cell.column.id === "actions");

              return (
                <Card
                  key={row.id}
                  className="bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {row.getVisibleCells().map((cell) => {
                        if (cell.column.id === "actions") return null;
                        const headerName =
                          cell.column.columnDef.headerName ||
                          cell.column.id.replace(/_/g, " ");

                        return (
                          <div key={cell.id} className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {headerName}
                            </p>
                            <div className="text-foreground">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {actionCell && (
                        <div className="pt-4 border-t border-border">
                          {flexRender(
                            actionCell.column.columnDef.cell,
                            actionCell.getContext()
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No results found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchplaceholder}
              value={globalFilter}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          {filterColumns.map((columnKey) => {
            const column = columns.find((col) => col.accessorKey === columnKey);
            const columnName =
              column?.headerName || columnKey.replace(/_/g, " ");
            const filterCount = (columnFilterValues[columnKey] || []).length;
            {
              /* const options = filterOptionsMap[columnKey] || []; */
            }

            return (
              <Popover
                key={columnKey}
                open={openFilter === columnKey}
                onOpenChange={() => handleFilterPopoverToggle(columnKey)}
              >
                <PopoverTrigger asChild>
                  <Button
                    // variant={filterCount > 0 ? "default" : "outline"}
                    variant={"outline"}
                    size="default"
                    className="px-3 text-sm font-medium flex items-center gap-2 border-dashed "
                  >
                    <Filter className="h-3 w-3 opacity-50" />
                    {columnName}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-56">
                  <Command>
                    <CommandInput placeholder={`Search ${columnName}...`} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filterOptionsMap[columnKey]?.map((rawValue) => {
                          const isSelected = (
                            columnFilterValues[columnKey] || []
                          ).includes(rawValue);

                          // Derive human-readable label (fallback to raw value)
                          const displayLabel =
                            FILTER_LABELS[columnKey]?.[rawValue] ?? rawValue;

                          return (
                            <CommandItem
                              key={rawValue}
                              onSelect={() =>
                                handleColumnFilterChange(
                                  columnKey,
                                  rawValue,
                                  !isSelected
                                )
                              }
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Check
                                  className={`h-4 w-4 ${
                                    isSelected ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {displayLabel}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {optionCounts[columnKey]?.[rawValue] ||
                                  rawValue ||
                                  0}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>

                      {/* Clear Filters button at bottom */}
                      {filterCount > 0 && (
                        <>
                          <CommandSeparator />
                          <div className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearColumnFilter(columnKey)}
                              className="w-full h-8 text-xs"
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center border border-border rounded-md bg-background">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("table")}
              className="rounded-none rounded-l-md"
            >
              <List className="h-4 w-4" />
              {/* <span className="hidden sm:inline ml-2">Table</span> */}
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("card")}
              className="rounded-none rounded-r-md"
            >
              <Grid3x3 className="h-4 w-4" />
              {/* <span className="hidden sm:inline ml-2">Card</span> */}
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border bg-background">
                Export <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={exportToCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border bg-background">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      onClick={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                    >
                      <Checkbox
                        checked={column.getIsVisible()}
                        className="mr-2"
                      />
                      {column.columnDef.headerName}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {viewMode === "card" ? (
        renderCardView()
      ) : (
        <div className="w-full border border-border rounded-lg overflow-x-auto overscroll-contain ">
          <div
            className="min-w-full max-h-[800px] overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-background border-border">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top" className="bg-card border-border">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full sm:w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-background border-border"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-background border-border"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-background border-border"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-background border-border"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
