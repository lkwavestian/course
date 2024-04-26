const path = require('path');

const { execSync } = require('child_process');
let _publicPath = '';
let _versions = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).replace(
    /\n|daily\//gi,
    ''
);
_publicPath = process.env.publicPath ? process.env.publicPath.replace('{versions}', _versions) : '';

export default {
    entry: 'src/index.js', //入口文件
    disableDynamicImport: false, //按需加载
    extraBabelPlugins: [
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
        [
            'import',
            { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true },
            'mobileImport',
        ],
    ],
    extraBabelIncludes: ['node_modules/qrcode.react'],
    env: {
        development: {
            disableCSSModules: false,
        },
        production: {
            disableCSSModules: false,
        },
    },
    alias: {
        components: path.resolve(__dirname, 'src/components/'),
        utils: path.join(__dirname, 'src/utils'),
    },
    // publicPath: _publicPath,
};
