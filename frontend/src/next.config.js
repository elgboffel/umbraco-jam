const compose = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");
const path = require("path");
const siteMap = require("./build/dato-cms/siteMap");

const nextConfig = {  
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader"
    });

    config.resolve.alias["~"] = path.resolve(`${__dirname}/src`);

    return config;
  },
  exportTrailingSlash: true,
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {

    try {
      return Object.values(siteMap).reduce((paths, page) => {   

        paths[`${page.url}`] = { page: `/${page.template}`, query: { path: `${page.url}`, id: `${page.id}` } };
        
        return paths;
      }, {});

    } catch (err) {
      console.error(err);
      return false;
    }
  }
};

module.exports = compose ([
  [withSass, {
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    }
  }]
], nextConfig);