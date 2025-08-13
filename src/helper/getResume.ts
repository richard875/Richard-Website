import { RESUME_FILE } from "../constants/meta";

const getResume = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault();
  window.open(`/${RESUME_FILE}`, "_blank");
};

export default getResume;
