const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  // worklets plugin comes from babel-preset-expo — don't add it twice
  return getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );
};
