import { AxiosRequestConfig } from "axios";
import IndexNow from "../types/indexNow";
import { HTTPS } from "../constants/meta";

const axioConfigIndexNow = (
  url: string,
  data: IndexNow
): AxiosRequestConfig => {
  return {
    url: `${HTTPS}${url}/indexnow`,
    method: "POST",
    maxBodyLength: Infinity,
    headers: { "Content-Type": "application/json; charset=utf-8" },
    data: JSON.stringify(data),
    validateStatus: () => true,
  } as AxiosRequestConfig;
};

export default axioConfigIndexNow;
