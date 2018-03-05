const _ = require('lodash');

module.exports = function arrayExcludeAndUnique(array) {
  // Only transform arrays
  if (!_.isArray(array)) {
    return false;
  }

  // Filter all non-strings
  const filteredArray = array.filter(item => _.isString(item));

  // Filter out all excludes
  const excludes = filteredArray.filter(s => s.startsWith('!')).map(s => s.substring(1));
  const removedExcludes = filteredArray.filter(s => !excludes.includes(s)).filter(s => !s.startsWith('!'));

  // Unique and return array
  return [...new Set(removedExcludes)];
};
