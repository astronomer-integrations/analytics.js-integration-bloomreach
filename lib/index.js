'use strict';

/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var foldl = require('foldl');
var each = require('each');
var keys = require('keys');
var extend = require('extend');
var includes = require('includes');
var map = require('map');

/**
 * Expose `Bloomreach` integration.
 */

var Bloomreach = module.exports = integration('Bloomreach')
.global('br_data')
.option('acctId', '')
.mapping('customMappings');


/**
 * Initialize.
 *
 * Documentation:
 *
 * @api public
 */

Bloomreach.prototype.initialize = function() {
    var acctId = this.options.acctId;
    window.br_data = window.br_data || [];
    var brtrk = document.createElement('script');
    brtrk.type = 'type/javascript';
    brtrk.async = true;
    brtrk.src = 'https:' == document.location.protocol ? "https://cdns.brsrvr.com/v1/br-trk-"+acctId+".js" : "http://cdn.brcdn.com/v1/br-trk-"+acctId+".js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(brtrk, s);
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

Bloomreach.prototype.loaded = function() {
    return !!(window.br_data);
};


/**
 * Add userId and email to queue
 */

Bloomreach.prototype._addDefaults = function() {
    // Site id.
    this._push(['acctId', this.options.acctId]);

    // UserId.
    var userId = this.analytics.user().id();
    this._push(['user_id', userId]);

};


/**
 * Track a page view
 *
 * @param {Facade} track
 */

Bloomreach.prototype.page = function() {
    this._addDefaults();
    window.br_data.push(['type', 'pageview']);
};


/**
 * Track event.
 */
 //QUESTION: What should happen with group? Should the mapping in 
 //BR have two fields - one for group and one for action.
 //(i.e. Bid on Item --> Group: cart; Action: bid)

Bloomreach.prototype.track = function(track) {
    var mappings = this.customMappings(track.event());
    if (mappings.length > 0) {
        each(function(mapping) {
            var group
            var action = mapping
            var options = []
            options.push(track.properties())
            options.push(this._addDefaults())
            BrTrk.getTracker().logEvent(group, action, options);
        }, mappings);
    } else {
        var group
        var action = track.event()
        var options = []
        options.push(track.properties())
        options.push(this._addDefaults())
        window.br_data.push(['_setAction', track.event()]);
        window.br_data.push(['_setParams', track.properties()]);
    }
};

/**
 * Viewed Product.
 */

Bloomreach.prototype.viewedProduct = function(track) {
    this._addDefaults();
    window.br_data.push(['type', 'pageview']);
    window.br_data.push(['ptype', 'product']);
    this._addBRProduct(track.id(),
                       track.sku(),
                       track.name(),
                       track.price(),
                       track.category());
};


/**
 * Completed Order.
 */

 //QUESTION: Should basket_value include tax + shipping (total)
 //or be total revenue (revenue)?

Bloomreach.prototype.completedOrder = function(track) {
    this._addDefaults();
    var self = this;
    this._push(['_addOrder', { order_id: track.orderId(),
                               basket_value: track.revenue() }]);
    each(function(product) {
        self._addBRProduct(product.id,
                           product.sku,
                           product.name,
                           product.price,
                           product.category);
    }, track.products() || []);
    this._push(['ptype', 'other']);
    this._push(['type', 'pageview']);
    //isConversion = 1 indicates it is part of conversion funnel
    //but not the end event (i.e. checkout)
    this._push(['isConversion', 1])
};



/**
 * Add a product to queue
 */

Bloomreach.prototype._addBRProduct = function(id, sku, name, price, category) {
    this._push({ prod_id: id,
                 sku: sku,
                 prod_name: name,
                 price: price,
                 cat: category });
};

/**
 * Add Product to Cart.
 */

 //QUESTION: Should a conversion pageview be fired during a addProduct
 //track call?

Bloomreach.prototype.addedProduct = function(track) {
    this._addDefaults();
    this._addBRProduct(track.id(),
                       track.sku(),
                       track.name(),
                       track.price(),
                       track.category()
                       );
    this._push(['ptype', 'other']);
    this._push(['type', 'page']);
    //isConversion = 0 indicates it is part of conversion funnel
    //but not the end event (i.e. checkout)
    this._push(['isConversion', 0])
    BrTrk.getTracker().logEvent('cart',
                                'click-add', 
                                {'prod_id': track.id(), 
                                'sku' : track.sku(),
                                'user_id': this.options.});
};


Bloomreach.prototype._push = function(arr) {
    var event = arr.slice(0, 1);

    if (arr.length > 1) {
        var param = arr[1];
        var paramType = Object.prototype.toString.call(param);
        if (paramType === '[object Object]') {
            var stringed = {};
            each(function(v, i) {
                stringed[i] = v ? String(v) : '';
            }, param);
            event.push(stringed);
        } else {
            event.push(param ? String(param) : '');
        }
    }

    window.br_data.push(event);
    return event;
};
