const path = require('path');

/**
 * Local Docusaurus plugin that contributes a themed component,
 * @theme/Z535SafetyAlert, implementing the ANSI Z535.4/Z535.6
 * signal-word-panel convention for DANGER / WARNING / CAUTION / NOTICE.
 *
 * getThemePath() is the same mechanism @docusaurus/theme-classic uses to
 * publish @theme/Admonition, @theme/CodeBlock, etc. Anything placed in the
 * returned directory becomes resolvable as @theme/<filename>, and remains
 * swizzle-overridable by consuming sites.
 */
module.exports = function docusaurusPluginZ535(context, options) {
  return {
    name: 'docusaurus-plugin-z535',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
  };
};
