const path = require('path');
const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            'react-native-notifier/next': path.join(
              __dirname,
              '..',
              './src/next/index.tsx'
            ),
            [pak.name]: path.join(__dirname, '..', pak.source),
          },
        },
      ],
    ],
  };
};
