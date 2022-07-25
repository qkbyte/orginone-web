const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
    hot: true,
    inline: true,
    hotOnly: true,
    port: 8081,
    proxy: {
      "/dev-api": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          "^/dev-api": "",
        },
      },
      "/dev-app": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          "^/dev-app": "asset-bpm/app",
        },
      },
      "/dev-bmp": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          "^/dev-bmp": "asset-bpm",
        },
      },
      "/dev-mobile": {
        target: process.env.VUE_APP_MOBILE_API,
        changeOrigin: true,
        pathRewrite: {
          "^/dev-mobile": "",
        }
      },
      "/jgd-service": {
        target: process.env.VUE_APP_BASEJGD_API, //首页资产卡片请求地址
        changeOrigin: true,
        pathRewrite: {
          "^/jgd-service": "",
        }
      },
      "/platform": {
        target: process.env.VUE_APP_BASEJGD_API, //首页资产卡片请求地址
        changeOrigin: true,
        pathRewrite: {
          // "^/platform": "",
        }
      },
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/variables.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@components", resolve("src/components"))
      .set("@assets", resolve("src/assets"))
      .set("@views", resolve("src/views"))
      .set("@directives", resolve("src/directives"))
      .set("@utils", resolve("src/utils"))
      .set("@layout", resolve("src/layout"))
      .set("@store", resolve("src/store"))
      .set("@styles", resolve("src/styles"))
      .set("@api", resolve("src/api"));
  },
};
