"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useCountriesQuery } from "@/lib/queries/lookupQueries";
import { fetchStatesByCountry } from "@/services/lookups/api";
import { useQueryClient } from "@tanstack/react-query";

const LookupContext = createContext(null);

export const useLookup = () => useContext(LookupContext);

export function LookupProvider({ children }) {
  const queryClient = useQueryClient(); // NOW WORKS
  const [countries, setCountries] = useState([]);
  const [statesMap, setStatesMap] = useState({});

  const { data: countriesData } = useCountriesQuery();

  useEffect(() => {
    if (countriesData) {
      setCountries(countriesData || []);
    }
  }, [countriesData]);

  const loadStates = useCallback(
    async (countryCode) => {
      if (statesMap[countryCode]) {
        return statesMap[countryCode];
      }

      const states = await queryClient.fetchQuery({
        queryKey: ["states", countryCode],
        queryFn: () => fetchStatesByCountry(countryCode),
        staleTime: 1000 * 60 * 60,
      });

      setStatesMap((prev) => ({ ...prev, [countryCode]: states }));

      return states;
    },
    [statesMap, queryClient]
  );

  return (
    <LookupContext.Provider value={{ countries, statesMap, loadStates }}>
      {children}
    </LookupContext.Provider>
  );
}
