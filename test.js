/*!
 * helper-changelog <https://github.com/jonschlinkert/helper-changelog>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var moment = require('moment');
var App = require('templates');
var changelog = require('./');
var app, helper;

describe('changelog', function() {
  beforeEach(function() {
    app = new App();
    app.create('pages');
    app.engine('md', require('engine-base'));
    app.helper('changelog', changelog());
  })

  it('should generate a changelog from a yaml file:', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/a.yml") %>'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);

      assert.equal(res.content, [
        '## [v0.2.0] - 2016-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in another chimney.',
        '',
        '## [v0.1.0] - 2015-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in a chimney last night.',
        ''
      ].join('\n'));
      cb();
    });
  });

  it('should generate a changelog from a markdown file:', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md") %>'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      cb();
    });
  });

  it('should add reflinks for headings when "owner/name" is on the context', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md") %>'});
    app.data({name: 'assemble-core', owner: 'assemble'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should use "owner/name" passed on helper locals', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md", {name: "assemble-core", owner: "assemble"}) %>'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should use "owner/name" passed on render locals', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md") %>'});
    app.render('foo.md', {name: 'assemble-core', owner: 'assemble'}, function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should add reflinks for headings when "repo" is on the context', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md") %>'});
    app.data({repo: 'assemble/assemble-core'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should use "repo" passed on helper locals', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md", {repo: "assemble/assemble-core"}) %>'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should use "repo" passed on render locals', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/changelog.md") %>'});
    app.render('foo.md', {repo: 'assemble/assemble-core'}, function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      assert(res.content.indexOf('0.25.0...0.26.0') !== -1);
      cb();
    });
  });

  it('should not fail when headings do not match', function(cb) {
    app.page('foo.md', {content: '<%= changelog("fixtures/foo.md") %>'});
    app.data({name: 'assemble-core', owner: 'assemble'});
    app.render('foo.md', function(err, res) {
      if (err) return cb(err);
      assert(/### key/.test(res.content));
      cb();
    });
  });

  it('should generate a changelog from an object passed to the helper:', function(cb) {
    var str = '<%= changelog({ "v0.2.0": { date: "2016-12-26", changes: [ "Got stuck in another chimney." ] } }) %>';

    app.page('bar.md', {content: str});
    app.render('bar.md', function(err, res) {
      if (err) return cb(err);

      assert.equal(res.content, [
        '## [v0.2.0] - 2016-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in another chimney.',
        '',
      ].join('\n'));
      cb();
    });
  });

  it('should generate a changelog from an array passed to the helper:', function(cb) {
    var str = '<%= changelog([{date: "2016-12-26", version: "v0.2.0", changes: [ "Got stuck in another chimney." ]}]) %>';

    app.page('bar.md', {content: str});
    app.render('bar.md', function(err, res) {
      if (err) return cb(err);

      assert.equal(res.content, [
        '## [v0.2.0] - 2016-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in another chimney.',
        '',
      ].join('\n'));
      cb();
    });
  });

  it('should generate a changelog from an array passed on the context:', function(cb) {
    var data = {
      changes: [
        {date: '2016-12-26', version: 'v0.2.0', changes: [ 'Got stuck in another chimney.' ]
      }]
    };

    app.page('bar.md', {content: '<%= changelog(changes) %>'});
    app.render('bar.md', data, function(err, res) {
      if (err) return cb(err);

      assert.equal(res.content, [
        '## [v0.2.0] - 2016-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in another chimney.',
        '',
      ].join('\n'));
      cb();
    });
  });

  it('should allow a custom date function:', function(cb) {
    var data = {
      changes: [
        {date: '2016-12-26', version: 'v0.2.0', changes: [ 'Got stuck in another chimney.' ]
      }],
      opts: {
        dateFn: function(date) {
          return ' * ' + moment(date).format('YYYY-MM-DD');
        }
      }
    };

    app.page('bar.md', {content: '<%= changelog(changes, opts) %>'});
    app.render('bar.md', data, function(err, res) {
      if (err) return cb(err);

      assert.equal(res.content, [
        '## [v0.2.0] - 2016-12-26',
        '',
        '**changes**',
        '',
        '- Got stuck in another chimney.',
        '',
      ].join('\n'));
      cb();
    });
  });
});
