import { WindowLocation } from "@reach/router";
import { MODE, STANDALONE } from "../constants/meta";

const usePwaDetection = (location: WindowLocation) => {
  const params = new URLSearchParams(location.search);
  return params.get(MODE) === STANDALONE;
};

export default usePwaDetection;
