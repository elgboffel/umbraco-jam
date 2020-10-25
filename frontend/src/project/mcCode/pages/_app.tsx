import React from "react";
import App from "next/app";
import "@foundation/scss/index.scss";

class Site extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    return <Component {...pageProps} key={router.asPath} />;
  }
}

export default Site;
