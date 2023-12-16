import React from "react";
import { navigate } from "gatsby";
import Route from "../routes/route";

const NotFoundPage = () => {
  React.useEffect(() => {
    const redirectToHome = () => navigate(Route.Home);
    redirectToHome();
  }, []);

  return <></>;
};

export default NotFoundPage;
