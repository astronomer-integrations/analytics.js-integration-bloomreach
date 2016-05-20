'use strict';

var Analytics = require('analytics.js-core').constructor;
var integration = require('analytics.js-integration');
var sandbox = require('clear-env');
var tester = require('analytics.js-integration-tester');
var BloomReach  = require('../lib');
var options = { acctId: 5397 };

describe('analytics.js-integration-bloomreach', function () {
  var analytics;
  var BloomReach;

  beforeEach(function () {
    analytics = new Analytics();
    BloomReach = new BloomReach(options);
    analytics.use(BloomReach);
    analytics.use(tester);
    analytics.add(BloomReach);
  });

  afterEach(function () {
    analytics.restore();
    analytics.reset();
    BloomReach.reset();
    sandbox();
  });

  describe('after loading', function () {
    beforeEach(function (done) {
        analytics.once('ready', done);
        analytics.initialize();
    });
  });
});
