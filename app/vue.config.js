module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: ['./src/assets/styles/global.scss'],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },
  configureWebpack: {
    externals: {
      jquery: 'jQuery',
    },
  },
};
