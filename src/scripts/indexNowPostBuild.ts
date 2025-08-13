import fs from "fs";
import { Reporter } from "gatsby";
import table from "../helper/table";
import safeRequest from "./safeRequest";
import indexNowDoc from "../constants/indexNowDoc";

const INDEXNOW_URL = "api.indexnow.org";
const BING_URL = "www.bing.com";
const NAVER_URL = "searchadvisor.naver.com";
const SEZNAM_URL = "search.seznam.cz";
const YANDEX_URL = "yandex.com";
const YEP_URL = "indexnow.yep.com";

const indexNowPostBuild = async (reporter: Reporter) => {
  // Write File to Public Folder
  const filePath = `./public/${process.env.INDEXNOW_KEY!}.txt`;
  fs.writeFileSync(filePath, process.env.INDEXNOW_KEY!);

  // Requests
  const indexNowResponse = await safeRequest(INDEXNOW_URL, reporter);
  const bingResponse = await safeRequest(BING_URL, reporter);
  const naverResponse = await safeRequest(NAVER_URL, reporter);
  const seznamResponse = await safeRequest(SEZNAM_URL, reporter);
  const yandexResponse = await safeRequest(YANDEX_URL, reporter);
  const yepResponse = await safeRequest(YEP_URL, reporter);

  // Log Response
  reporter.info("------------------IndexNow Response------------------");
  reporter.info(`${indexNowResponse.status} ${indexNowResponse.statusText}`);
  reporter.info("--------------------Bing Response--------------------");
  reporter.info(`${bingResponse.status} ${bingResponse.statusText}`);
  reporter.info("--------------------Naver Response-------------------");
  reporter.info(`${naverResponse.status} ${naverResponse.statusText}`);
  reporter.info("-------------------Seznam Response-------------------");
  reporter.info(`${seznamResponse.status} ${seznamResponse.statusText}`);
  reporter.info("-------------------Yandex Response-------------------");
  reporter.info(`${yandexResponse.status} ${yandexResponse.statusText}`);
  reporter.info("-------------------Yep Response-------------------");
  reporter.info(`${yepResponse.status} ${yepResponse.statusText}`);

  reporter.info("----------------IndexNow Status Chart----------------");
  reporter.info(`\n${table(indexNowDoc)}`);
};

export default indexNowPostBuild;
