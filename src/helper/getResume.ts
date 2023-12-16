const PDF_PATH = "/richard-lee-resume.pdf";

const getResume = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.preventDefault();
  window.open(PDF_PATH, "_blank");
};

export default getResume;
