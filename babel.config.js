// eslint-disable-next-line no-undef, import/no-extraneous-dependencies
const { getConfig } = require('@airbnb/config-babel');

const config = getConfig({
  library: true,
  react: true,
  next: true,
  typescript: true,
  env: {
    corejs: 3,
    useBuiltIns: 'usage',
  },
});

config.plugins.push([
  '@babel/plugin-transform-runtime',
  {
    corejs: 3,
  },
]);

// Override to allow transpile es modules inside vega-lite
config.ignore = config.ignore.filter(item => item !== 'node_modules/');
config.ignore.push('node_modules/(?!vega-lite)');

// eslint-disable-next-line no-undef
module.exports = config;
