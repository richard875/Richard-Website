import axios from "axios";
import { Reporter } from "gatsby";
import { google } from "googleapis";
import { HTTPS } from "../constants/meta";
import urlList from "../helper/siteUrlList";
import axioConfigGoogle from "../helper/axioConfigGoogle";

// Hosting providers inject env vars directly, bypassing dotenv's
// double-quoted-string escape handling that the local .env files rely on,
// so the key can arrive with literal "\n" sequences, real newlines, or
// stray surrounding quotes depending on how it was pasted into the dashboard.
const normalizePrivateKey = (key: string) =>
  key
    .trim()
    .replace(/^"(.*)"$/s, "$1")
    .replace(/\\n/g, "\n");

const googlePostBuild = async (reporter: Reporter) => {
  try {
    // Variables
    const client_email = process.env.GOOGLE_CLIENT_EMAIL!;
    const private_key = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY!);

    const jwtClient = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: [`${HTTPS}www.googleapis.com/auth/indexing`],
    });

    const token = await jwtClient.authorize();
    for (const url of urlList) {
      reporter.info(`-----Indexing ${url}-----`);

      const config = axioConfigGoogle(url, token.access_token);
      const response = await axios.request(config);

      reporter.info(
        `Response Status: ${response.status} ${response.statusText}`,
      );

      if (response.data.error) {
        reporter.info(
          `Error: ${response.data.error.code} ${response.data.error.status}`,
        );
        reporter.info(`Error Message: ${response.data.error.message}`);
      } else {
        reporter.info(
          `Success: ${
            response.data.urlNotificationMetadata?.latestUpdate?.type ||
            "URL Updated"
          } at ${new Date(
            response.data.urlNotificationMetadata?.latestUpdate?.notifyTime ||
              new Date(),
          ).toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Australia/Sydney",
          })} Australian Eastern Time`,
        );
      }
    }

    reporter.info(
      "For Google indexing errors, please visit: https://developers.google.com/search/apis/indexing-api/v3/core-errors",
    );
  } catch (error) {
    reporter.warn(`Google indexing failed: ${error}`);
  }
};

export default googlePostBuild;
