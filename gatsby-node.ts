import dotenv from "dotenv";
import { Reporter } from "gatsby";
import indexNowPostBuild from "./src/scripts/indexNowPostBuild";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Post Build
exports.onPostBuild = async ({ reporter }: { reporter: Reporter }) => {
  // Post Build Script Index Now (Bing, Naver, Seznam, Yandex)
  await indexNowPostBuild(reporter);
};
