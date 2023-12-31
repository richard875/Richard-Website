import dotenv from "dotenv";
import { Reporter } from "gatsby";
import googlePostBuild from "./src/scripts/googlePostBuild";
import indexNowPostBuild from "./src/scripts/indexNowPostBuild";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Post Build
exports.onPostBuild = async ({ reporter }: { reporter: Reporter }) => {
  // Post Build Script Google
  reporter.info("-------------------Google Indexing-------------------");
  await googlePostBuild(reporter);
  reporter.info("-----------------------------------------------------");

  // Post Build Script Index Now (Bing, Naver, Seznam, Yandex)
  reporter.info("------------------IndexNow Indexing------------------");
  await indexNowPostBuild(reporter);
  reporter.info("-----------------------------------------------------");
};
