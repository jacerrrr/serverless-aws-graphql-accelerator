const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const slsw = require('serverless-webpack');
const plugins = [new MomentLocalesPlugin()];
if (slsw.lib.webpack.isLocal) {
  plugins.push(
    /**
     * This is due to the fact the both TypeORM and TypeGraphQL is using a global variable for storage.
     * This is only needed in development.
     *
     * When the module that's been hot reloaded is requested, the decorators are executed again, and we get
     * new entries.
     *
     * @see https://github.com/typeorm/typeorm/blob/ba1798f29d5adca941cf9b70d8874f84efd44595/src/index.ts#L176-L180
     * @see https://github.com/MichalLytek/type-graphql/blob/1eb65b44ca70df1b253e45ee6081bf5838ebba37/src/metadata/getMetadataStorage.ts#L5
     */
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: `
        delete global.TypeGraphQLMetadataStorage;
        delete global.typeormMetadataArgsStorage;
      `,
      raw: true,
    }),
  );
}


module.exports = {
  devtool: 'source-map',
  entry: slsw.lib.entries,
  externals: [nodeExternals({ whitelist: [ /^moment/, /^iterall/ ] })],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader?configFile=src/tsconfig.app.json',
          },
        ],
      },
    ],
  },
  optimization: {
    nodeEnv: false,
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins,
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'node',
};
