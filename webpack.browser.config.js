const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/browser.js', // Создадим отдельный entry для браузера
    output: {
        filename: 'bundle.js',
        path: __dirname,
        library: {
            name: 'PeopleScript',
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    target: 'web',
    resolve: {
        extensions: ['.js'],
        alias: {
            fs: false,
            path: false
        }
    },
    stats: {
        colors: true
    }
};