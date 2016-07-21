/*!
 * helper-changelog <https://github.com/jonschlinkert/helper-changelog>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var stringify = require('stringify-changelog');
var merge = require('mixin-deep');

module.exports = function(options) {
  options = options || {};

  return function(changelog, locals) {
    var opts = merge({}, options, locals);
    if (this && this.context) {
      opts = merge({}, this.options, this.context, opts);
    }

    changelog = changelog || opts.changelog;
    if (typeof changelog === 'string') {
      var ext = path.extname(changelog);
      var cwd = opts.cwd || process.cwd();
      var fp = path.resolve(cwd, changelog);
      var str = fs.readFileSync(fp, 'utf8');

      if (ext && !/\.(json|ya?ml)$/.test(ext)) {
        var repo = getRepo(opts);
        if (repo) str += '\n' + createLinks(str, repo);
        return str;
      }
    }
    return stringify(changelog, opts);
  };
};

function getRepo(ctx) {
  var repo = ctx.repo;
  if (repo) return repo;
  if (ctx.name && (ctx.owner || ctx.username)) {
    return (ctx.owner || ctx.username) + '/' + ctx.name;
  }
}

function createLinks(str, repo) {
  var re = /^#+ (\[[^\]]+\])/gm;
  var range = (str.match(re) || []).map(function(str) {
    return str.replace(/^#+ \[|\]$/g, '');
  });

  var len = range.length;
  var idx = -1;
  var res = [];
  while (++idx < len) {
    var curr = range[idx];
    var prev = range[idx + 1];
    if (!prev) break;
    res.push(createLink(curr, prev, repo));
  }
  return res.join('\n');
}

function createLink(curr, prev, repo) {
  return `[${curr}]: https://github.com/${repo}/compare/${prev}...${curr}`;
}
