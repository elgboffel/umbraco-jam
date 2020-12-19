import React from "react";
import App from "next/app";
import { ThemeProvider } from "theme-ui";
import { theme } from "@foundation/styles/theme";

class Site extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} key={router.asPath} />
      </ThemeProvider>
    );
  }
}

export default Site;
