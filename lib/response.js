import { decryption } from "@/lib/encryption";

export const successResponse = (res, isEncrypted = false) => {
  let successData;

  try {
    const apiData = res?.data?.data;

    if (apiData == null) {
      console.error("No success data available", res);
      return { message: "No data found" };
    }

    if (isEncrypted) {
      try {
        const decrypted = decryption(apiData);
        successData = decrypted ?? { message: "No data found" };
      } catch (err) {
        console.error("Success decryption failed", err);
        successData = { message: "No data found" };
      }
    } else {
      successData = apiData;
    }

    return successData;
  } catch (err) {
    console.error("Success response utility crashed", err);
    return { message: "Internal Server Error" };
  }
};

export const errorResponse = (err, isEncrypted = false) => {
  let errorData;

  try {
    const apiError = err?.response?.data?.data;

    if (apiError == null) {
      console.error("No error data available", err);
      return { message: "No data found" };
    }

    if (isEncrypted) {
      try {
        const decrypted = decryption(apiError);
        errorData = decrypted ?? { message: "No data found" };
      } catch (e) {
        console.error("Error decryption failed", e);
        errorData = { message: "No data found" };
      }
    } else {
      errorData = apiError;
    }

    return errorData;
  } catch (e) {
    console.error("Error response utility crashed", e);
    return { message: "Internal Server Error" };
  }
};
