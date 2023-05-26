const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: ['./src/assets/styles/global.scss'],
    },
  },
  // configureWebpack: {
  //   plugins: [...( process.env.NODE_ENV !== 'production' ? new BundleAnalyzerPlugin()): undefined],
  // },
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader');
  },
  pwa: {
    themeColor: '#eb008b',
  },
};
