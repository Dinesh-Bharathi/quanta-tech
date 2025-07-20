"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function RolesFiltersDebounced({ onFiltersChange, loading }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [searchInput, setSearchInput] = useState("");

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      const newFilters = { ...filters, search: searchValue };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    }, 500),
    [filters, onFiltersChange]
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Handle status change
  const handleStatusChange = (value) => {
    const newFilters = { ...filters, status: value === "all" ? "" : value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = { search: "", status: "" };
    setFilters(clearedFilters);
    setSearchInput("");
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.status;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search roles by name or description..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={handleStatusChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          disabled={loading}
          size="sm"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
