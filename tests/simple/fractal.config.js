const fractal = require('@frctl/fractal').create();
const kuchenblech = require('../../src');

// Global settings
fractal.set('project.title', 'Simple Fractal Demo With Kuchenblech');

// Use kuchenblech theme
fractal.web.theme(kuchenblech());

// Components
fractal.components.engine('@frctl/nunjucks');
fractal.components.set('ext', '.nunj');
fractal.components.set('path', 'components');
fractal.components.set('default.status', 'wip');
fractal.components.set('default.collated', true);
fractal.components.set('default.preview', '@preview');

// Setup docs
fractal.docs.engine('@frctl/nunjucks');
fractal.docs.set('ext', '.md');
fractal.docs.set('path', 'docs');

// Export fractal instance
module.exports = fractal;
