const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const antVariables = require('./src/styles/ant-variables');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: antVariables,
  }),
);
