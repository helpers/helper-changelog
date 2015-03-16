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
    template.page('foo.md', {content: '<%= changelog("fixtures/a.yml") %>'});
    template.render('foo.md', function (err, content) {
      if (err) console.log(err);

      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));
      done();
    });
  });

  it('should generate a changelog from an object passed to the helper:', function (done) {
    var str = '<%= changelog({ "v0.1.0": { date: "2016-12-26", changes: [ "Got stuck in another chimney." ] } }) %>';

    template.page('bar.md', {content: str});
    template.render('bar.md', function (err, content) {
      if (err) console.log(err);

      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));
      done();
    });
  });

  it('should generate a changelog from an array passed to the helper:', function (done) {
    var str = '<%= changelog([{date: "2016-12-26", version: "v0.1.0", changes: [ "Got stuck in another chimney." ]}]) %>';

    template.page('bar.md', {content: str});
    template.render('bar.md', function (err, content) {
      if (err) console.log(err);

      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));
      done();
    });
  });

  it('should generate a changelog from an array passed on the context:', function (done) {
    var data = {
      changes: [
        {date: '2016-12-26', version: 'v0.1.0', changes: [ 'Got stuck in another chimney.' ]
      }]
    };

    template.page('bar.md', {content: '<%= changelog(changes) %>'});
    template.render('bar.md', data, function (err, content) {
      if (err) console.log(err);

      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));
      done();
    });
  });

  it('should allow a custom date function:', function (done) {
    var data = {
      changes: [
        {date: '2016-12-26', version: 'v0.1.0', changes: [ 'Got stuck in another chimney.' ]
      }],
      opts: {
        dateFn: function (date) {
          return ' * ' + moment(date).format('YYYY-MM-DD');
        }
      }
    };

    template.page('bar.md', {content: '<%= changelog(changes, opts) %>'});
    template.render('bar.md', data, function (err, content) {
      if (err) console.log(err);

      content.should.equal([
        '**DATE**       **VERSION**   **CHANGES**                  ',
        '* 2016-12-26   v0.1.0        Got stuck in another chimney.',
      ].join('\n'));
      done();
    });
  });
});
