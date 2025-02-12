import axios from "axios";
import { Reporter } from "gatsby";
import { google } from "googleapis";
import { HTTPS } from "../constants/meta";
import urlList from "../helper/siteUrlList";
import axioConfigGoogle from "../helper/axioConfigGoogle";

const googlePostBuild = async (reporter: Reporter) => {
  // Variables
  const client_email = process.env.GOOGLE_CLIENT_EMAIL!;
  const private_key = process.env
    .GOOGLE_PRIVATE_KEY!.split(String.raw`\n`)
    .join("\n");

  const jwtClient = new google.auth.JWT(
    client_email,
    null as any,
    private_key,
    [`${HTTPS}www.googleapis.com/auth/indexing`],
    null as any
  );

  const token = await jwtClient.authorize();
  for (const url of urlList) {
    reporter.info(`-----Indexing ${url}-----`);

    const config = axioConfigGoogle(url, token.access_token);
    const response = await axios.request(config);

    reporter.info(`Response Status: ${response.status} ${response.statusText}`);

    if (response.data.error) {
      reporter.info(
        `Error: ${response.data.error.code} ${response.data.error.status}`
      );
      reporter.info(`Error Message: ${response.data.error.message}`);
    } else {
      reporter.info(
        `Success: ${
          response.data.urlNotificationMetadata?.latestUpdate?.type ||
          "URL Updated"
        } at ${new Date(
          response.data.urlNotificationMetadata?.latestUpdate?.notifyTime ||
            new Date()
        ).toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Australia/Sydney",
        })} Australian Eastern Time`
      );
    }
  }

  reporter.info(
    "For Google indexing errors, please visit: https://developers.google.com/search/apis/indexing-api/v3/core-errors"
  );
};

export default googlePostBuild;
