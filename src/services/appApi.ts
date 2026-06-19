import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const BASE_URL = "https://momentum.redberryinternship.ge/api/";
const TOKEN = "a20743a4-ad62-4c50-978a-cc88c92ecd07";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export async function getData(endpoint: string) {
  const res = await axios.get(BASE_URL + endpoint, { headers });
  return res.data;
}

export async function postData<T = unknown, R = unknown>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> {
  try {
    // 1. Detect if the payload is a FormData object
    const isFormData = data instanceof FormData;

    const res = await axios.post<R>(`${BASE_URL}${endpoint}`, data, {
      ...config,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        // 2. Only apply application/json if it's NOT a file upload
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...config?.headers,
      },
    });
    return res;
  } catch (error) {
    // If axios returned a response body, log it for easier debugging (validation errors etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = error as any;
    if (anyErr?.response?.data) {
      console.error(
        `Post request to ${endpoint} failed. Response:`,
        anyErr.response.data
      );
    } else {
      console.error(`Post request to ${endpoint} failed:`, error);
    }
    throw error;
  }
}

export async function putData<T = unknown, R = unknown>(
  endpoint: string,
  data: T,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<R>> {
  try {
    // 1. Detect if the payload is a FormData object
    const isFormData = data instanceof FormData;

    const res = await axios.put<R>(`${BASE_URL}${endpoint}`, data, {
      ...config,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        // 2. Only apply application/json if it's NOT a file upload
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...config?.headers,
      },
    });
    return res;
  } catch (error) {
    // If axios returned a response body, log it for easier debugging (validation errors etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyErr = error as any;
    if (anyErr?.response?.data) {
      console.error(
        `Put request to ${endpoint} failed. Response:`,
        anyErr.response.data
      );
    } else {
      console.error(`Put request to ${endpoint} failed:`, error);
    }
    throw error;
  }
}