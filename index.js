/*!
 * helper-changelog <https://github.com/jonschlinkert/helper-changelog>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var stringify = require('stringify-changelog');
var merge = require('mixin-deep');

module.exports = function changelog(app) {
  var val = app && app.option && app.option('changelog');
  return function (data, options) {
    data = data || val || null;

    if (!data) {
      throw new Error('helper-changelog cannot find data or a file to read.');
    }
    return stringify(data, options);
  };
};
