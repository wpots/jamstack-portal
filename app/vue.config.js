const path = require('path');
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: ['./src/assets/styles/global.scss'],
    });
}
module.exports = {
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) => addStyleResource(config.module.rule('scss').oneOf(type)));
  },
  configureWebpack: {
    externals: {
      jquery: 'jQuery',
    },
  },
};
