const _ = require('lodash');
const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('../helpers/array-exclude-and-unique');

module.exports = class TenantHelper {
  setDefault(tenants) {
    this.defaultTenants = arrayify(tenants) || [];
  }

  getTenantsForComponent(component) {
    if (!component.config.variants || component.config.variants.length === 0) {
      return arrayify(component.config.tenant || component.tenant || this.defaultTenants);
    }

    return component.config.variants
      .map(variant => arrayify(_.get(variant, 'config.tenant', variant.tenant)))
      .map(tenant => (_.isString(tenant) && [tenant]) || tenant)
      .reduce(
        (tenants, allTenants) => [...allTenants, ...tenants],
        arrayify(component.config.tenant || component.tenant || this.defaultTenants)
      )
      .filter(tenant => _.isString(tenant) && !tenant.startsWith('!'))
      .filter((tenant, index, self) => self.indexOf(tenant) === index);
  }

  getTenantsForVariant(variant) {
    const variantObj = variant.parent.config.variants.find(v => v.name === variant.name);

    return arrayExcludeAndUnique([
      ...arrayify(variant.parent.config.tenant || variant.parent.tenant || this.defaultTenants),
      ...arrayify(_.get(variantObj, 'config.tenant', variantObj.tenant)),
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

    return tenants.length === 0 || tenants.includes(tenant) || tenants.includes('*');
  }

  withoutCollections(collection) {
    return collection.newSelf(collection.toArray().filter(i => !i.isCollection));
  }
};
