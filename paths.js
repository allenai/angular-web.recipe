/**
 * The quintessential Flapjack.  Everything you need for a scrumptious serving of
 * HTML, CSS and Javascript.
 *
 * @property {string} var     Path to to the directory where runtime data is stored.
 * @property {string} build   Path to the directory where the built output should be stored.
 * @property {string} less    The path to project's LESS files.
 * @property {string} js      Path to the project's Javascript files.
 * @property {string} assets  Path to the project's assets.
 * @property {string} html    Path to the project's HTML files.
 */
var src = 'src/';
module.exports = {
  src: src,
  var: 'var',
  build: 'build',
  js: src + 'main.js',
  assets: src + 'assets/**/*',
  less: src + 'styles.less',
  html: src + '**/*.html'
};
