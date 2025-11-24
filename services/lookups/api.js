import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

// GET countries
export const fetchCountries = async () => {
  const res = await axiosInstance.get(API_ENDPOINTS.COUNTRIES);
  return res.data.data;
};

// GET states for a country
export const fetchStatesByCountry = async (countryCode) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.STATES_BY_COUNTRY.replace(":countryCode", countryCode)
  );
  return res.data.data;
};

// GET country details
export const fetchCountryDetails = async (countryCode) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.COUNTRY_DETAILS.replace(":countryCode", countryCode)
  );
  return res.data.data;
};
