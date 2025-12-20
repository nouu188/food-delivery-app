const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (config, context) => {
  const isHMR = process.env.HMR === 'true';

  const baseConfig = {
    output: {
      path: join(__dirname, '../../dist/apps/restaurant-service'),
      clean: true,
      ...(process.env.NODE_ENV !== 'production' && {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      }),
    },
    externals: isHMR
      ? [
          nodeExternals({
            allowlist: ['webpack/hot/poll?100'],
          }),
        ]
      : {
          'pg': 'commonjs pg',
          'pg-native': 'commonjs pg-native',
          'class-transformer': 'commonjs class-transformer',
          'class-validator': 'commonjs class-validator'
        },
    plugins: [
      new NxAppWebpackPlugin({
        target: 'node',
        compiler: 'tsc',
        main: './src/main.ts',
        tsConfig: './tsconfig.app.json',
        optimization: false,
        outputHashing: 'none',
        generatePackageJson: true,
        sourceMaps: true,
      }),
    ],
  };

  if (isHMR) {
    const hmrConfig = require('../../webpack-hmr.config');
    return hmrConfig(baseConfig, context);
  }

  return baseConfig;
};
