const _ = require('lodash');
const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('../helpers/array-exclude-and-unique');

module.exports = class TenantHelper {
  getTenantsForComponent(component) {
    if (!component.config.variants || component.config.variants.length === 0) {
      return arrayify(component.config.tenant || []);
    }

    return component.config.variants
      .map(variant => arrayify(variant.tenant) || [])
      .map(tenant => (_.isString(tenant) && [tenant]) || tenant)
      .reduce(
        (tenants, allTenants) => [...allTenants, ...tenants],
        arrayify(component.config.tenant || [])
      )
      .filter(tenant => _.isString(tenant) && !tenant.startsWith('!'))
      .filter((tenant, index, self) => self.indexOf(tenant) === index);
  }

  getTenantsForVariant(variant) {
    return arrayExcludeAndUnique([
      ...arrayify(variant.parent.config.tenant || []),
      ...arrayify(variant.parent.config.variants.find(v => v.name === variant.name).tenant || []),
    ]);
  }

  getTenants(componentOrVariant) {
    if (componentOrVariant.isVariant) {
      return this.getTenantsForVariant(componentOrVariant);
    } else if (componentOrVariant.isComponent) {
      return this.getTenantsForComponent(componentOrVariant);
    }

    return false;
  }

  includes(componentOrVariant, tenant) {
    const tenants = this.getTenants(componentOrVariant);

    if (!tenants) {
      return false;
    }

    return tenants.length === 0 || tenants.includes(tenant);
  }

  withoutCollections(collection) {
    return collection.newSelf(collection.toArray().filter(i => !i.isCollection));
  }
};
