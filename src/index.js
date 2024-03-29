const path = require('path');
const Theme = require('@frctl/fractal').WebTheme;
const utils = require('@frctl/fractal').utils;
const _ = require('lodash');
const pretty = require('js-object-pretty-print').pretty;
const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('./helpers/array-exclude-and-unique');
const getResolvers = require('./resolvers');
const packageJSON = require('../package.json');
const TenantHelper = require('./tenants/tenant-helper');
const mixin = require('./mixin');

module.exports = function KuchenblechTheme(options) {
  // Build configuration
  const config = _.defaultsDeep(_.clone(options || {}), {
    skin: 'default',
    rtl: false,
    lang: 'en',
    styles: 'default',
    scripts: 'default',
    format: 'json',
    static: {
      mount: 'themes/kuchenblech',
    },
    version: packageJSON.version,
    favicon: null,
    nav: ['docs', 'components'],
  });

  // Stylesheets
  config.styles = []
    .concat(config.styles)
    .concat(config.stylesheet)
    .filter(url => url)
    .map(url => (url === 'default' ? `/${config.static.mount}/stylesheets/main.css` : url));

  // Scripts
  config.scripts = []
    .concat(config.scripts)
    .filter(url => url)
    .map(url => (url === 'default' ? `/${config.static.mount}/javascripts/main.js` : url));

  // Tenant helper
  const tenantHelper = new TenantHelper();

  // Register theme
  const theme = new Theme(path.join(__dirname, '..', 'views'), config);

  // Set error page
  theme.setErrorView('_error.njk');

  // Add static files
  theme.addStatic(path.join(__dirname, '..' , 'dist'), `/${config.static.mount}`);

  // Get resolvers
  const resolvers = getResolvers(tenantHelper);

  // Index route
  theme.addRoute('/', {
    handle: 'index',
    view: 'routes/document.njk',
  });

  // Index tenant route
  theme.addRoute('/:tenant', {
    handle: 'tenant',
    view: 'routes/document.njk',
  }, resolvers.tenants);

  // Component single
  theme.addRoute('/:tenant?/components/:component', {
    handle: 'component',
    view: 'routes/component.njk',
  }, resolvers.components);

  // Component preview
  theme.addRoute('/:tenant?/components/:component/preview/:preview?', {
    handle: 'preview',
    view: 'routes/preview.njk',
  }, resolvers.previews);

  // Document single
  theme.addRoute('/:tenant?/docs/:document+', {
    handle: 'document',
    view: 'routes/document.njk',
  }, resolvers.documents);

  // Add filters
  theme.on('init', (env) => {
    // Add utils
    env.engine.addGlobal('_', _);
    env.engine.addGlobal('utils', utils);

    // Set tenantHelper
    tenantHelper.init(env._globals);
    env.engine.addGlobal('tenantHelper', tenantHelper);

    // Set getFirstComponent
    env.engine.addGlobal('getFirstComponent', (components, tenant = null) => {
      if (tenant) {
        return components
          .flatten()
          .filter(component => component.isComponent && tenantHelper.includes(component, tenant))
          .map((component) => {
            if (component.variants().size > 1 && !component.collated) {
              return component.variants().filter(
                variant => tenantHelper.includes(variant, tenant)
              ).first();
            }

            return component;
          })
          .first();
      }

      return components
        .flatten()
        .filter(component => component.isComponent && !component.isHidden)
        .first();
    });

    // Filters
    env.engine.addFilter('debug', input => `<pre>${pretty(input)}</pre>`);
    env.engine.addFilter('arrayify', input => arrayify(input).filter(i => i !== undefined));
    env.engine.addFilter('arrayExcludeAndUnique', arrayExcludeAndUnique);
    env.engine.addFilter('linkRefs', string => string.replace(
      /(?:^|[^a-zA-Z0-9_＠!@#$%&*])(?:(?:@|＠)(?!\/))([a-zA-Z0-9/_-]{1,})(?:\b(?!@|＠)|$)/gi,
      (match) => {
        try {
          const handle = match.trim().replace('@', '');
          const url = theme.urlFromRoute('component', { component: handle });
          return ` <a href="${url}">@${handle}</a>`;
        } catch (e) {
          return match;
        }
      },
    ));
  });

  return theme;
};

// Export mixin
module.exports.tenantMixin = mixin;
