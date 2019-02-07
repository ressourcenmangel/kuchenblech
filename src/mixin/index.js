const utils = require('@frctl/fractal/src/core/utils');

const newDefault = {
  components: {
    default: {
      tenant: [],
      tenantContext: {},
    },
  },
};

module.exports = (fractal) => {
  function proxiedCreate(config = {}) {
    return fractal.create(utils.defaultsDeep(config, newDefault));
  };

  proxiedCreate.create = (config = {}) => fractal.create(utils.defaultsDeep(config, newDefault));
  proxiedCreate.Fractal = fractal.Fractal;
  proxiedCreate.WebTheme = fractal.WebTheme;
  proxiedCreate.CliTheme = fractal.CliTheme;
  proxiedCreate.Adapter = fractal.Adapter;
  proxiedCreate.utils = fractal.utils;
  proxiedCreate.core = fractal.core;

  return proxiedCreate;
};
