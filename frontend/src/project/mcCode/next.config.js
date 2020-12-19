const compose = require("next-compose-plugins");
// const withSass = require("@zeit/next-sass");
const path = require("path");
// const siteMap = require("../../../site/siteMap");
const withTM = require("next-transpile-modules")([
  "./src/feature",
  "./src/foundation",
]);

const nextConfig = {
  webpack: function (config, { dev }) {
    /* enable to read .md files */
    // config.module.rules.push({
    //   test: /\.md$/,
    //   use: "raw-loader"
    // });

    /* Resolve alias */
    config.resolve.alias["~"] = path.resolve(`${__dirname}/src`);
    config.resolve.alias["@feature"] = path.resolve(`${__dirname}/src/feature`);
    config.resolve.alias["@foundation"] = path.resolve(
      `${__dirname}/src/foundation`
    );

    /* Resolve Eslint */
    if (dev) {
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "eslint-loader",
        exclude: ["/node_modules/", "/.next/", "/out/"],
        enforce: "pre",
        options: {
          emitWarning: true,
          fix: true,
        },
      });
    }

    return config;
  },
  target: "serverless",
  distDir: "../../../dist/mcCode/client",
  trailingSlash: false,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  images: {
    deviceSizes: [420, 620, 768, 1024, 1280],
    imageSizes: [400],
    iconSizes: [],
    domains: [process.env.NEXT_PUBLIC_UMBRACO_BASE_PATH],
    path: "/_next/image",
    loader: "default",
  },
};

module.exports = compose([withTM], nextConfig);
