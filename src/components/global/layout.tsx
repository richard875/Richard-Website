import React from "react";
import PropTypes from "prop-types";
import { createTheme } from "styled-breakpoints";
import { ThemeProvider } from "styled-components";

const Layout = ({ children }: { children: any }) => {
  const theme = createTheme({
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px",
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
