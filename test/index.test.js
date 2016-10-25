'use strict';

var Analytics = require('@astronomerio/analytics.js-core').constructor;
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var Bloomreach  = require('../lib');
var options = { acctId: 5397 };


describe('Bloom Reach', function() {

  var analytics;
  var br;
  var options = {};

  beforeEach(function() {
    analytics = new Analytics();
    br = new Bloomreach(options);
    analytics.use(Bloomreach);
    analytics.use(tester);
    analytics.add(br);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    br.reset();
    sandbox();
  });

  describe('after loading', function () {
    beforeEach(function(done) {
      analytics.once('ready', done);
      analytics.initialize();
    });

    describe('#track', function () {
      beforeEach(function () {
        analytics.stub(br, 'fireTrackingPixel');
      });

      describe('#productViewed', function () {
        it('should call fireTrackingPixel', function () {
          analytics.track('Viewed Product', {});
          analytics.called(br.fireTrackingPixel);
        });
      });

      describe('#productCategoryViewed', function () {
        it('should call fireTrackingPixel', function () {
          analytics.track('Viewed Product Category', {});
          analytics.called(br.fireTrackingPixel);
        });
      });
    });
  });
});
