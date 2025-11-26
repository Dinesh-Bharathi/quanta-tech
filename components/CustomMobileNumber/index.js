"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Phone } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLookup } from "@/context/LookupContext";
import Image from "next/image";
import _ from "lodash";

export function MobileNumberField({
  value = "",
  countryCode = "91",
  onValueChange,
  onCountryChange,
  onValidationChange,
  label,
  placeholder = "Enter mobile number",
  error,
  required = false,
  disabled = false,
  className,
  id = "mobile-number",
  name = "mobileNumber",
}) {
  const { countries } = useLookup();
  const [open, setOpen] = React.useState(false);
  const [internalError, setInternalError] = React.useState("");

  // Get selected country details
  const selectedCountry = React.useMemo(
    () => countries.find((c) => c.phonecode === countryCode),
    [countries, countryCode]
  );

  // Validate phone number length
  const validatePhoneNumber = React.useCallback(
    (phoneValue) => {
      if (!phoneValue) {
        setInternalError("");
        onValidationChange?.(true);
        return true;
      }

      if (!selectedCountry?.phoneNumber) {
        onValidationChange?.(true);
        return true;
      }

      const { minLength, maxLength } = selectedCountry.phoneNumber;

      if (minLength && phoneValue.length < minLength) {
        const errorMsg = `Phone number must be at least ${minLength} digits`;
        setInternalError(errorMsg);
        onValidationChange?.(false);
        return false;
      }

      if (maxLength && phoneValue.length > maxLength) {
        const errorMsg = `Phone number must not exceed ${maxLength} digits`;
        setInternalError(errorMsg);
        onValidationChange?.(false);
        return false;
      }

      setInternalError("");
      onValidationChange?.(true);
      return true;
    },
    [selectedCountry, onValidationChange]
  );

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    // Check max length constraint
    if (
      selectedCountry?.phoneNumber?.maxLength &&
      numericValue.length > selectedCountry.phoneNumber.maxLength
    ) {
      return;
    }

    onValueChange?.(numericValue);
    validatePhoneNumber(numericValue);
  };

  // Handle country selection
  const handleCountrySelect = (isoCode) => {
    setOpen(false);

    // Revalidate phone number with new country
    const newCountry = countries.find((c) => c.isoCode === isoCode);
    onCountryChange?.(newCountry?.phonecode);
    if (value && newCountry?.phoneNumber) {
      const { minLength, maxLength } = newCountry.phoneNumber;

      if (minLength && value.length < minLength) {
        setInternalError(`Phone number must be at least ${minLength} digits`);
      } else if (maxLength && value.length > maxLength) {
        setInternalError(`Phone number must not exceed ${maxLength} digits`);
      } else {
        setInternalError("");
      }
    }
  };

  // Handle input blur
  const handleBlur = () => {
    validatePhoneNumber(value);
  };

  // Filter countries for search
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.isoCode.toLowerCase().includes(query) ||
        country.phoneNumber?.callingCode?.includes(query)
    );
  }, [countries, searchQuery]);

  const displayError = error || internalError;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-2">
        {/* Country Code Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select country"
              disabled={disabled}
              className={cn(
                "w-[140px] justify-between",
                displayError && "border-destructive"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedCountry ? (
                  <>
                    <Image
                      src={selectedCountry.flagUrl}
                      alt={`${selectedCountry.name} flag`}
                      className="h-4 w-6 object-cover rounded"
                      loading="lazy"
                      width={24}
                      height={16}
                    />
                    <span className="text-sm">
                      {selectedCountry.phoneNumber?.callingCode ||
                        selectedCountry.phonecode}
                    </span>
                  </>
                ) : (
                  <span className="text-sm">Select</span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
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
                      key={country.isoCode}
                      value={country.isoCode}
                      onSelect={handleCountrySelect}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          countryCode === country.isoCode
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <Image
                        src={country.flagUrl}
                        alt={`${country.name} flag`}
                        className="h-4 w-6 object-cover rounded"
                        loading="lazy"
                        width={24}
                        height={16}
                      />
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.phoneNumber?.callingCode ||
                          `+${country.phonecode}`}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={id}
              name={name}
              type="tel"
              inputMode="numeric"
              placeholder={placeholder}
              value={value}
              onChange={handlePhoneChange}
              onBlur={handleBlur}
              disabled={_.isEmpty(countryCode) || disabled}
              // required={required}
              className={cn(
                "pl-10",
                displayError &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              aria-invalid={!!displayError}
              aria-describedby={displayError ? `${id}-error` : undefined}
            />
          </div>
        </div>
      </div>

      {/* Helper Text / Error Message */}
      <div className="min-h-[20px]">
        {displayError ? (
          <p
            id={`${id}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {displayError}
          </p>
        ) : (
          selectedCountry?.phoneNumber && (
            <p className="text-sm text-muted-foreground">
              {selectedCountry.phoneNumber.minLength ===
              selectedCountry.phoneNumber.maxLength
                ? `Enter ${selectedCountry.phoneNumber.minLength} digits`
                : `Enter ${selectedCountry.phoneNumber.minLength}-${selectedCountry.phoneNumber.maxLength} digits`}
              {selectedCountry.phoneNumber.exampleNumber &&
                ` (e.g., ${selectedCountry.phoneNumber.exampleNumber})`}
            </p>
          )
        )}
      </div>
    </div>
  );
}
