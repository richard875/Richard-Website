import Route from "../routes/route";
import { HTTPS } from "../constants/meta";

const SITE_URL_HTTPS = `${HTTPS}${process.env.GATSBY_SITE_URL!}`;
const urlList = Object.values(Route)
  .filter((path) => path !== Route.NotFound)
  .map((path) => `${SITE_URL_HTTPS}${path === Route.Home ? "" : path}`);

export default urlList;
