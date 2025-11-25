"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useLookup } from "@/context/LookupContext";
import Image from "next/image";

export function CountryField({
  value = "",
  onValueChange,
  label,
  placeholder = "Select country",
  error,
  required = false,
  disabled = false,
  className,
  id = "country",
  name = "country",
  showFlag = true,
  showCallingCode = false,
}) {
  const { countries } = useLookup();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get selected country details
  const selectedCountry = React.useMemo(
    () => countries.find((c) => c.name === value),
    [countries, value]
  );

  // Handle country selection
  const handleCountrySelect = (name) => {
    onValueChange?.(name);
    setOpen(false);
    setSearchQuery("");
  };

  // Filter countries for search
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countries;

    const query = searchQuery.toLowerCase().trim();
    return countries.filter((country) => {
      const nameMatch = country.name.toLowerCase().includes(query);
      const isoCodeMatch = country.isoCode.toLowerCase().includes(query);
      const phonecodeMatch = country.phonecode?.toString().includes(query);
      const callingCodeMatch = country.phoneNumber?.callingCode
        ?.replace("+", "")
        .includes(query.replace("+", ""));

      return nameMatch || isoCodeMatch || phonecodeMatch || callingCodeMatch;
    });
  }, [countries, searchQuery]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedCountry && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedCountry ? (
                <>
                  {showFlag && (
                    <Image
                      src={selectedCountry.flagUrl}
                      alt={`${selectedCountry.name} flag`}
                      className="h-4 w-6 object-cover rounded"
                      loading="lazy"
                      width={24}
                      height={16}
                    />
                  )}
                  <span className="truncate">{selectedCountry.name}</span>
                  {showCallingCode &&
                    selectedCountry.phoneNumber?.callingCode && (
                      <span className="text-sm text-muted-foreground">
                        {selectedCountry.phoneNumber.callingCode}
                      </span>
                    )}
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 opacity-50" />
                  <span>{placeholder}</span>
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search country..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.name}
                    value={country.name}
                    onSelect={handleCountrySelect}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === country.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {showFlag && (
                      <Image
                        src={country.flagUrl}
                        alt={`${country.name} flag`}
                        className="h-4 w-6 object-cover rounded"
                        loading="lazy"
                        width={24}
                        height={16}
                      />
                    )}
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {country.isoCode || ``}
                    </span>
                    {showCallingCode && (
                      <span className="text-sm text-muted-foreground">
                        {country.phoneNumber?.callingCode ||
                          `+${country.phonecode}`}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
