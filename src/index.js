const path = require('path');
const Theme = require('@frctl/fractal').WebTheme;
const _ = require('lodash');
const pretty = require('js-object-pretty-print').pretty;
const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('./helpers/array-exclude-and-unique');
const resolvers = require('./resolvers');
const packageJSON = require('../package.json');
const TenantHelper = require('./tenants/tenant-helper');

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
  theme.setErrorView('_error.nunj');

  // Add static files
  theme.addStatic(path.join(__dirname, '..' , 'dist'), `/${config.static.mount}`);

  // Index route
  theme.addRoute('/', {
    handle: 'index',
    view: 'routes/document.nunj',
  });

  // Index tenant route
  theme.addRoute('/:tenant', {
    handle: 'tenant',
    view: 'routes/document.nunj',
  }, resolvers.tenants);

  // Component single
  theme.addRoute('/:tenant?/components/:component', {
    handle: 'component',
    view: 'routes/component.nunj',
  }, resolvers.components);

  // Component preview
  theme.addRoute('/:tenant?/components/:component/preview/:preview?', {
    handle: 'preview',
    view: 'routes/preview.nunj',
  }, resolvers.previews);

  // Document single
  theme.addRoute('/:tenant?/docs/:document+', {
    handle: 'document',
    view: 'routes/document.nunj',
  }, resolvers.documents);

  // Add filters
  theme.on('init', (env) => {
    // Globals
    env.engine.addGlobal('tenantHelper', tenantHelper);
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
  });

  return theme;
};
