const compose = require("next-compose-plugins");
// const withSass = require("@zeit/next-sass");
const path = require("path");
// const siteMap = require("../../../site/siteMap");
const withTM = require("next-transpile-modules")(["./src/feature", "./src/foundation"]);

const nextConfig = {  
  webpack: function (config) {    
    /* enable to read .md files */
    // config.module.rules.push({
    //   test: /\.md$/,
    //   use: "raw-loader"
    // });

    /* Resolve alias */
    config.resolve.alias["~"] = path.resolve(`${__dirname}/src`);

    return config;
  },
  distDir: "../../../dist/client",
  trailingSlash: true,
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

module.exports = compose ([
    withTM,
  // Setup css modules with sass
  //[withSass, {
  //   cssModules: true,
  //   cssLoaderOptions: {
  //     importLoaders: 1,
  //     localIdentName: "[local]___[hash:base64:5]",
  //   }
  // }]
], nextConfig);