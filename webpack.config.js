const path = require('path');

module.exports = {
    entry: {
        'demographics': './src/demographics.ts',
        'absolute': './src/absolute.ts',
        'relative': './src/relative.ts',
        'causes': './src/causes.ts'
    },
    devtool: 'inline-source-map',
    mode: "development",
    // Typescript
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]

    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './static'
    },
};

