const arrayify = require('arrayify');
const arrayExcludeAndUnique = require('./helpers/array-exclude-and-unique');

module.exports = (tenantHelper) => {
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

  const componentResolver = (app) => {
    const handles = [];
    const push = (entity, tenant = null) => {
      handles.push({ tenant, component: entity.handle });
    };

    let tenants = tenantResolver(app).map(tenant => tenant.tenant);
    if (tenants.length === 0) {
      tenants = [null];
    }

    const components = app.components.filter('isHidden', false).flatten();
    components.each((component) => {
      tenants.forEach((tenant) => {
        if (!tenant || tenantHelper.includes(component, tenant)) {
          if (component.isCollection || component.collated) {
            push(component, tenant);
          }

          if (component.variants().size > 1 && !component.collated) {
            component.variants().each((variant) => {
              if (!tenant || tenantHelper.includes(variant, tenant)) {
                push(variant, tenant);
              }
            });
          }
        }
      });
    });

    return handles;
  };

  const previewResolver = (app) => {
    const handles = [];
    const push = (entity, tenant = null) => {
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
    };

    let tenants = tenantResolver(app).map(tenant => tenant.tenant);
    if (tenants.length === 0) {
      tenants = [null];
    }

    const components = app.components.filter('isHidden', false).flatten();
    components.each((component) => {
      tenants.forEach((tenant) => {
        if (!tenant || tenantHelper.includes(component, tenant)) {
          if (component.variants().size > 1) {
            component.variants().each((variant) => {
              if (!tenant || tenantHelper.includes(variant, tenant)) {
                push(variant, tenant);
              }
            });
          } else {
            push(component, tenant);
          }
        }
      });
    });

    return handles;
  };

  return {
    tenants: tenantResolver,
    components: componentResolver,
    previews: previewResolver,
    documents: documentResolver,
  };
};
