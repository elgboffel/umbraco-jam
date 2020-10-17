import React from "react";
import App from "next/app";
import "@foundation/scss/index.scss";
import SiteLayout from "@feature/Layouts/SiteLayout";

class Site extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <SiteLayout>
        <Component {...pageProps} key={router.asPath} />
      </SiteLayout>
    );
  }
}

export default Site;
