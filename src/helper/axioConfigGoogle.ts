import { AxiosRequestConfig } from "axios";
import { HTTPS } from "../constants/meta";

const URL_UPDATED = "URL_UPDATED";
const GOOGLE_INDEXING_URL = `${HTTPS}indexing.googleapis.com/v3/urlNotifications:publish`;

const axioConfigGoogle = (
  url: string,
  accessToken: string | null | undefined
) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const data = {
    url: url,
    type: URL_UPDATED,
  };

  return {
    url: GOOGLE_INDEXING_URL,
    method: "POST",
    maxBodyLength: Infinity,
    headers: headers,
    data: JSON.stringify(data),
    validateStatus: () => true,
  } as AxiosRequestConfig;
};

export default axioConfigGoogle;
