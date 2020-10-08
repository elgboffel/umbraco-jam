import "~/foundation/scss/index.scss";
import React from "react";
import App from "next/app";
import SiteLayout from "~/feature/SiteLayout";

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
