const replace = require("replace");
const { dir } = require('./helpers');
/**
 * This replaces all .scss extensions with .css
 */
replace({
  regex: /\.scss/,
  replacement: '.css',
  paths: [dir('build')],
  recursive: true,
  silent: false
});
