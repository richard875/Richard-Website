import axios from "axios";
import { Reporter } from "gatsby";
import IndexNow from "../types/indexNow";
import { HTTPS } from "../constants/meta";
import urlList from "../helper/siteUrlList";
import axioConfigIndexNow from "../helper/axioConfigIndexNow";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY!;
const data: IndexNow = {
  host: process.env.GATSBY_SITE_URL!,
  key: INDEXNOW_KEY,
  keyLocation: `${HTTPS}${process.env.GATSBY_SITE_URL!}/${INDEXNOW_KEY}.txt`,
  urlList: urlList,
};

const safeRequest = async (url: string, reporter: Reporter) => {
  try {
    return await axios.request(axioConfigIndexNow(url, data));
  } catch (error: any) {
    const msg = error.message;
    const warning = "API Endpoint Failed";
    const valid = typeof msg === "string" && msg.trim() !== "" ? msg : warning;

    reporter.warn(`IndexNow request to ${url} failed: ${valid}`);
    return { status: 800, statusText: warning };
  }
};

export default safeRequest;
