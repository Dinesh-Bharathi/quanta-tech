import { useQuery } from "@tanstack/react-query";
import { fetchCountries, fetchStatesByCountry } from "@/services/lookups/api";

// Query Key Generators
export const lookupKeys = {
  countries: ["countries"],
  states: (countryCode) => ["states", countryCode],
};

// Fetch + Cache Countries
export const useCountriesQuery = () =>
  useQuery({
    queryKey: lookupKeys.countries,
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

// Fetch + Cache States
export const useStatesQuery = (countryCode, enabled = false) =>
  useQuery({
    queryKey: lookupKeys.states(countryCode),
    queryFn: () => fetchStatesByCountry(countryCode),
    staleTime: 1000 * 60 * 60 * 24,
    enabled, // Only fetch when countryCode exists
  });
