'use strict';

var integration = require('analytics.js-integration');

var Bloomreach = module.exports = integration('Bloom Reach')
.assumesPageview()
.global('BrTrk')
.option('acctId', '')
.mapping('customMappings');

Bloomreach.prototype.initialize = function() {
    var acctId = this.options.acctId;
    var br_data = {};

    br_data.acct_id = acctId;
    br_data.ptype = '';
    br_data.cat_id = '';
    br_data.cat = '';
    br_data.prod_id = '';
    br_data.prod_name = '';
    br_data.sku = '';
    br_data.search_term = '';
    br_data.is_conversion = '';
    br_data.basket_value = '';
    br_data.order_id = '';

    window.br_data = br_data;

    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('async', true);

    scriptElement.src = 'https:' == document.location.protocol ? "https://cdns.brsrvr.com/v1/br-trk-" + acctId + ".js" : "http://cdn.brcdn.com/v1/br-trk-" + acctId + ".js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptElement, s);

    this.ready();
};

Bloomreach.prototype.loaded = function() {
    return !!BrTrk;
};

Bloomreach.prototype.track = function(track) {
};

Bloomreach.prototype.viewedProduct = function(track) {
};

Bloomreach.prototype.completedOrder = function(track) {
};
