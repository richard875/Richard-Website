import { AxiosRequestConfig } from "axios";
import IndexNow from "../types/indexNow";

const axioConfigIndexNow = (
  url: string,
  data: IndexNow
): AxiosRequestConfig => {
  return {
    url: url,
    method: "POST",
    maxBodyLength: Infinity,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    data: JSON.stringify(data),
    validateStatus: () => true,
  } as AxiosRequestConfig;
};

export default axioConfigIndexNow;
