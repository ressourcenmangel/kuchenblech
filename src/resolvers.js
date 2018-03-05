const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('./helpers/array-exclude-and-unique');
const TenantHelper = require('./tenants/tenant-helper');

const tenantHelper = new TenantHelper();

const pushComponent = (app, handles, entity, tenant = null) => {
  handles.push({ tenant, component: entity.handle });
  return handles;
};

const pushComponentWithPreview = (app, handles, entity, tenant = null) => {
  let previews = arrayExcludeAndUnique(arrayify(entity.preview));
  if (entity.preview.name) {
    previews = [`@${entity.preview.name}`];
  }

  previews.forEach((preview) => {
    const previewComponent = app.components.find(preview);
    if (previewComponent) {
      handles.push({ tenant, component: entity.handle, preview: previewComponent.handle });
    }
  });

  return handles;
};

const tenantResolver = app => app.docs.collections().items().map(
  tenant => ({ tenant: tenant.name })
);

const documentResolver = app => app.docs.filter(doc => (!doc.isHidden && doc.path !== ''))
  .flatten()
  .items()
  .map(doc => (doc.parent.path ? {
    document: doc.path.substring(doc.parent.path.length + 1),
    tenant: doc.parent.path,
  } : {
    document: doc.path,
  }))
  .filter(doc => doc.document);

const generateComponentResolver = pushHelper => ((app) => {
  let handles = [];

  let tenants = tenantResolver(app).map(tenant => tenant.tenant);
  if (tenants.length === 0) {
    tenants = [null];
  }

  const components = app.components.filter('isHidden', false).flatten();
  components.each((component) => {
    tenants.forEach((tenant) => {
      if (!tenant || tenantHelper.includes(component, tenant)) {
        if (component.isCollection || component.collated) {
          handles = pushHelper(app, handles, component, tenant);
        }

        if (component.variants().size > 1 && !component.collated) {
          component.variants().each((variant) => {
            if (!tenant || tenantHelper.includes(variant, tenant)) {
              handles = pushHelper(app, handles, variant, tenant);
            }
          });
        }
      }
    });
  });

  return handles;
});

module.exports = {
  tenants: tenantResolver,
  components: generateComponentResolver(pushComponent),
  previews: generateComponentResolver(pushComponentWithPreview),
  documents: documentResolver,
};
