/*!
 * helper-changelog <https://github.com/jonschlinkert/helper-changelog>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var stringify = require('stringify-changelog');
var extend = require('extend-shallow');

module.exports = function(changelog, locals) {
  var opts = extend({}, locals);
  if (this && this.context) {
    opts = extend({}, this.options, this.context, opts);
  }
  changelog = changelog || opts.changelog;
  var res = stringify(changelog, opts);
  if (opts.changelogFooter === true) {
    return res + '\n' + '_(Changelog generated by [helper-changelog][])_';
  }
  return res;
};
