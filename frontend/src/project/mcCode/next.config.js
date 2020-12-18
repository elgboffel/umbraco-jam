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
    console.log(
      "Getting data from: ",
      process.env.NEXT_PUBLIC_UMBRACO_BASE_PATH
    );
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
  // Old way of ssg before getStaticProps and getStaticPaths
  // exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
  //
  //   try {
  //
  //     return Object.values(siteMap).reduce((paths, page) => {
  //
  //       paths[`${page.url}`] = {page: `/${page.template}`, query: {path: `${page.url}`, id: `${page.id}`}};
  //
  //       return paths;
  //     }, {})
  //
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   }
  // }
};

module.exports = compose(
  [
    withTM,
    // Setup css modules with sass
    //[withSass, {
    //   cssModules: true,
    //   cssLoaderOptions: {
    //     importLoaders: 1,
    //     localIdentName: "[local]___[hash:base64:5]",
    //   }
    // }]
  ],
  nextConfig
);
