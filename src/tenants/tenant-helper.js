const _ = require('lodash');
const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('../helpers/array-exclude-and-unique');

module.exports = class TenantHelper {
  init(app) {
    this.app = app;
    this.defaultTenants = arrayify(app.components.get('default.tenant'));
  }

  finalizeTenantList(tenants) {
    const allTenants = this.app.docs.collections().items().map(tenant => tenant.name);

    const fixedTenants = arrayExcludeAndUnique(tenants.reduce((ts, tenant) => {
      if (tenant === '*') {
        allTenants.forEach(t => ts.push(t));
      } else {
        ts.push(tenant);
      }

      return ts;
    }, []));

    return fixedTenants;
  }

  getTenantsForComponent(component) {
    const componentTenants = this.finalizeTenantList(
      arrayify(component.config.tenant || component.tenant || this.defaultTenants)
    );

    if (!component.config.variants || component.config.variants.length === 0) {
      return componentTenants;
    }

    const variantTenants = component.config.variants
      .map(variant => [
        ...componentTenants,
        ...arrayify(_.get(variant, 'config.tenant', variant.tenant)),
      ])
      .map(tenants => this.finalizeTenantList(tenants))
      .reduce((tenants, t) => [...tenants, ...t], []);

    return [
      ...componentTenants,
      ...variantTenants,
    ].filter((tenant, index, self) => self.indexOf(tenant) === index);
  }

  getTenantsForVariant(variantInput) {
    const component = variantInput.parent;
    const componentTenants = this.finalizeTenantList(
      arrayify(component.config.tenant || component.tenant || this.defaultTenants)
    );

    const variant = component.config.variants.find(v => v.name === variantInput.name);
    const variantTenants = this.finalizeTenantList([
      ...componentTenants,
      ...arrayify(_.get(variant, 'config.tenant', variant.tenant)),
    ]);

    return variantTenants;
  }

  getTenants(entity) {
    if (entity.isVariant) {
      return this.getTenantsForVariant(entity);
    } else if (entity.isComponent) {
      return this.getTenantsForComponent(entity);
    }

    return [];
  }

  includes(entity, tenant) {
    const tenants = this.getTenants(entity);
    return tenants.length === 0 || tenants.includes(tenant);
  }

  withoutCollections(collection) {
    return collection.newSelf(collection.toArray().filter(i => !i.isCollection));
  }
};
