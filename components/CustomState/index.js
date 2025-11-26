"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
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

export function StateField({
  value = "",
  countryName = "",
  onValueChange,
  label,
  placeholder = "Select state",
  error,
  required = false,
  disabled = false,
  className,
  id = "state",
  name = "state",
}) {
  const { countries } = useLookup();
  const { loadStates, statesMap } = useLookup();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [states, setStates] = React.useState([]);

  // Get states for selected country
  // const states = React.useMemo(() => {
  //   if (!countryCode) return [];
  //   return State.getStatesOfCountry(countryCode);
  // }, [countryCode]);

  React.useEffect(() => {
    if (countryName) {
      const foundCountry = countries.find((c) => c.name === countryName);
      loadStates(foundCountry.isoCode).then((s) => setStates(s));
    }
  }, [countryName, countries]);

  // Get selected state details
  const selectedState = React.useMemo(
    () => states.find((s) => s.name === value),
    [states, value]
  );

  // Handle state selection
  const handleStateSelect = (value) => {
    const stateValue = states.find((s) => s.name === value);
    onValueChange?.(stateValue.name);
    setOpen(false);
    setSearchQuery("");
  };

  // Filter states for search
  const filteredStates = React.useMemo(() => {
    if (!searchQuery) return states;

    const query = searchQuery.toLowerCase().trim();
    return states.filter((state) => {
      const nameMatch = state.name.toLowerCase().includes(query);
      const isoCodeMatch = state.isoCode.toLowerCase().includes(query);
      return nameMatch || isoCodeMatch;
    });
  }, [states, searchQuery]);

  // Reset value when country changes
  React.useEffect(() => {
    if (value && !states.find((s) => s.name === value)) {
      onValueChange?.("");
    }
  }, [countryName, states, value, onValueChange]);

  const isDisabled = disabled || !countryName || states.length === 0;

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
            disabled={isDisabled}
            className={cn(
              "w-full justify-between",
              !selectedState && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedState ? (
                <>
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span className="truncate">{selectedState.name}</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 opacity-50" />
                  <span>
                    {!countryName
                      ? "Select country first"
                      : states.length === 0
                      ? "No states available"
                      : placeholder}
                  </span>
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search state..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {filteredStates.map((state) => (
                  <CommandItem
                    key={state.name}
                    value={state.name}
                    onSelect={handleStateSelect}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === state.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1 truncate">{state.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {state.isoCode}
                    </span>
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

      {!countryName && (
        <p className="text-sm text-muted-foreground">
          Please select a country first
        </p>
      )}
    </div>
  );
}
