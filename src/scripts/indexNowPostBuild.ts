import fs from "fs";
import axios from "axios";
import { Reporter } from "gatsby";
import IndexNow from "../types/indexNow";
import { HTTPS } from "../constants/meta";
import indexNowDoc from "../constants/indexNowDoc";
import table from "../helper/table";
import urlList from "../helper/siteUrlList";
import axioIdxNow from "../helper/axioConfigIndexNow";

const INDEXNOW_URL = "api.indexnow.org";
const BING_URL = "www.bing.com";
const NAVER_URL = "searchadvisor.naver.com";
const SEZNAM_URL = "search.seznam.cz";
const YANDEX_URL = "yandex.com";

const indexNowPostBuild = async (reporter: Reporter) => {
  // Variables
  const indexNowKey = process.env.INDEXNOW_KEY!;
  const SITE_URL = process.env.GATSBY_SITE_URL!;
  const SITE_URL_HTTPS = `${HTTPS}${process.env.GATSBY_SITE_URL!}`;

  // Write File to Public Folder
  const fileName = `${indexNowKey}.txt`;
  const filePath = `./public/${fileName}`;
  fs.writeFileSync(filePath, indexNowKey);

  // Construct Data
  const data: IndexNow = {
    host: SITE_URL,
    key: indexNowKey,
    keyLocation: `${SITE_URL_HTTPS}/${fileName}`,
    urlList: urlList,
  };

  // Request
  const indexNowResponse = await axios.request(axioIdxNow(INDEXNOW_URL, data));
  const bingResponse = await axios.request(axioIdxNow(BING_URL, data));
  const naverResponse = await axios.request(axioIdxNow(NAVER_URL, data));
  const seznamResponse = await axios.request(axioIdxNow(SEZNAM_URL, data));
  const yandexResponse = await axios.request(axioIdxNow(YANDEX_URL, data));

  // Log Response
  reporter.info("----------------IndexNow Response----------------");
  reporter.info(`${indexNowResponse.status} ${indexNowResponse.statusText}`);
  reporter.info("----------------Bing Response----------------");
  reporter.info(`${bingResponse.status} ${bingResponse.statusText}`);
  reporter.info("----------------Naver Response----------------");
  reporter.info(`${naverResponse.status} ${naverResponse.statusText}`);
  reporter.info("----------------Seznam Response----------------");
  reporter.info(`${seznamResponse.status} ${seznamResponse.statusText}`);
  reporter.info("----------------Yandex Response----------------");
  reporter.info(`${yandexResponse.status} ${yandexResponse.statusText}`);

  reporter.info(table(indexNowDoc));
};

export default indexNowPostBuild;
