import Route from "../routes/route";
import { HTTPS } from "../constants/meta";

const SITE_URL_HTTPS = `${HTTPS}${process.env.GATSBY_SITE_URL!}`;
const urlList = Object.values(Route)
  .filter((route) => route !== Route.NotFound)
  .map((route) => `${SITE_URL_HTTPS}${route}`);

export default urlList;
