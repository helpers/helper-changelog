/*!
 * helper-changelog <https://github.com/jonschlinkert/helper-changelog>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var moment = require('moment');
var Template = require('template');
var changelog = require('./');
var template, helper;

describe('changelog', function () {
  beforeEach(function () {
    template = new Template();
    helper = changelog(template);
    template.helper('changelog', helper);
  })

  it('should generate a changelog from a yaml file:', function (done) {
    template.page('readme.md', {content: '<%= changelog("fixtures/a.yml") %>'});
    template.render('readme.md', function (err, content) {
      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));

      done();
    })
  });

  it('should generate a changelog from an object:', function () {
    var data = { 'v0.1.0': { date: '2016-12-26', changes: [ 'Got stuck in another chimney.' ] } };
    changelog(data).should.equal([
      '**DATE**       **VERSION**   **CHANGES**                  ',
      '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
    ].join('\n'));
  });

  it('should generate a changelog from an array:', function () {
    var data = [
      {date: '2016-12-26', version: 'v0.1.0', changes: [ 'Got stuck in another chimney.' ]
    }];

    changelog(data).should.equal([
      '**DATE**       **VERSION**   **CHANGES**                  ',
      '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
    ].join('\n'));
  });

  it('should allow a custom date function:', function () {
    var data = [
      {date: '2016-12-26', version: 'v0.1.0', changes: [ 'Got stuck in another chimney.' ]
    }];

    var opts = {};
    opts.dateFn = function (date) {
      return ' * ' + moment(date).format('YYYY-MM-DD');
    };

    changelog(data, opts).should.equal([
      '**DATE**       **VERSION**   **CHANGES**                  ',
      '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
    ].join('\n'));
  });

  it('should throw an error:', function () {
    (function () {
      changelog();
    }).should.throw('helper-changelog cannot find data or a file to read.');
  });
});
