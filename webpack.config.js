const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'peoplescript.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'PeopleScript',
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    target: 'node',
    resolve: {
        extensions: ['.js']
    },
    externals: {
        fs: 'fs',
        path: 'path'
    },
    stats: {
        colors: true
    }
};