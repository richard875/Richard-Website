import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import Route from "./src/routes/route";
import IndexNow from "./src/types/indexNow";
import indexNowDoc from "./src/constants/indexNowDoc";
import table from "./src/helper/table";
import axioIdxNow from "./src/helper/axioConfigIndexNow";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const INDEXNOW_URL = "https://api.indexnow.org/indexnow";
const BING_URL = "https://www.bing.com/indexnow";
const NAVER_URL = "https://searchadvisor.naver.com/indexnow";
const SEZNAM_URL = "https://search.seznam.cz/indexnow";
const YANDEX_URL = "https://yandex.com/indexnow";

// Post Build
exports.onPostBuild = async () => {
  // Variables
  const indexNowKey = process.env.INDEXNOW_KEY!;
  const SITE_URL = process.env.GATSBY_SITE_URL!;
  const SITE_URL_HTTPS = `https://${process.env.GATSBY_SITE_URL!}`;

  // Write File to Public Folder
  const fileName = `.${indexNowKey}.txt`;
  const filePath = `./public/${fileName}`;
  fs.writeFileSync(filePath, indexNowKey);

  // Construct URL List excluding 404 page
  const urlList = Object.values(Route)
    .filter((route) => route !== Route.NotFound)
    .map((route) => `${SITE_URL_HTTPS}${route}`);

  // Construct Data
  const data: IndexNow = {
    host: SITE_URL,
    key: indexNowKey,
    keyLocation: `${SITE_URL_HTTPS}/${fileName}`,
    urlList: urlList,
  };

  // // Request
  // const indexNowResponse = await axios.request(axioIdxNow(INDEXNOW_URL, data));
  // const bingResponse = await axios.request(axioIdxNow(BING_URL, data));
  // const naverResponse = await axios.request(axioIdxNow(NAVER_URL, data));
  // const seznamResponse = await axios.request(axioIdxNow(SEZNAM_URL, data));
  // const yandexResponse = await axios.request(axioIdxNow(YANDEX_URL, data));

  // // Log Response
  // console.log("----------------IndexNow Response----------------");
  // console.log(`${indexNowResponse.status} ${indexNowResponse.statusText}`);
  // console.log("----------------Bing Response----------------");
  // console.log(`${bingResponse.status} ${bingResponse.statusText}`);
  // console.log("----------------Naver Response----------------");
  // console.log(`${naverResponse.status} ${naverResponse.statusText}`);
  // console.log("----------------Seznam Response----------------");
  // console.log(`${seznamResponse.status} ${seznamResponse.statusText}`);
  // console.log("----------------Yandex Response----------------");
  // console.log(`${yandexResponse.status} ${yandexResponse.statusText}`);

  console.info(table(indexNowDoc));
};
