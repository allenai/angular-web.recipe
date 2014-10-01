/**
 * This object must define paths for the following resources.  Each Path is a src
 * and a target.
 *
 * @property {string} VAR     Path to to the directory where runtime data is stored.
 * @property {string} BUILD   Path to the directory where the built output should be stored.
 * @property {string} LESS    The path to project's LESS files.
 * @property {string} JS      Path to the project's Javascript files.
 * @property {string} ASSETS  Path to the project's assets.
 * @property {string} HTML    Path to the project's HTML files.
 */
var SRC = 'src/';
var paths = {
  SRC: SRC,
  VAR: 'var',
  BUILD: 'build',
  JS: SRC + 'main.js',
  ASSETS: SRC + 'assets/**/*',
  LESS: SRC + 'styles.less',
  HTML: SRC + '**/*.html'
};
module.exports = paths;
