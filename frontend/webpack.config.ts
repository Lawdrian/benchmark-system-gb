// @ts-ignore
import path from "path";
// @ts-ignore
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Configuration, DefinePlugin } from "webpack";

const config: Configuration = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "./static/frontend"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                    },
                },
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('production')
        }),
        new ForkTsCheckerWebpackPlugin({
          async: false
        }),
    ]
}

export default config;