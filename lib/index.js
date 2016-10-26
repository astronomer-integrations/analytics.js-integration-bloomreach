'use strict';

var integration = require('@astronomerio/analytics.js-integration');

var Bloomreach = module.exports = integration('Bloom Reach')
.option('acctId', '')
.mapping('customMappings');

Bloomreach.prototype.page = function (page) {
    var name = page.name();
    var acctId = this.options.acctId;
    var br_data = {};
    br_data.acct_id = acctId;

    if (name === "Home") {
        br_data.ptype = 'homepage';
        br_data.cat_id = '';
        br_data.cat = '';
        br_data.prod_id = '';
        br_data.prod_name = '';
        br_data.sku = '';
        br_data.search_term = '';
        br_data.is_conversion = '0';
        br_data.basket_value = '';
        br_data.order_id = '';
    } else {
        br_data.ptype = 'other';
        br_data.cat_id = '';
        br_data.cat = '';
        br_data.prod_id = '';
        br_data.prod_name = '';
        br_data.sku = '';
        br_data.search_term = '';
        br_data.is_conversion = '0';
        br_data.basket_value = '';
        br_data.order_id = '';
    }

    window.br_data = br_data;
    this.fireTrackingPixel();
};

Bloomreach.prototype.productViewed = function (track) {
    var acctId = this.options.acctId;
    var br_data = {};

    br_data.acct_id = acctId;
    br_data.ptype = 'product';
    br_data.cat_id = '';
    br_data.cat = '';
    br_data.prod_id = track.id() || '';
    br_data.prod_name = document.title || track.properties().item_barcode || '';
    br_data.sku = track.sku() || track.properties().item_barcode;
    br_data.search_term = '';
    br_data.is_conversion = '0';
    br_data.basket_value = '';
    br_data.order_id = '';

    window.br_data = br_data;
    this.fireTrackingPixel();
};

Bloomreach.prototype.productListViewed = function (track) {
    var acctId = this.options.acctId;
    var br_data = {};

    br_data.acct_id = acctId;
    br_data.ptype = 'category';
    br_data.cat_id = track.id() || '';
    br_data.cat = track.category() || '';
    br_data.prod_id = '';
    br_data.prod_name = track.properties().item_barcode || '';
    br_data.sku = '';
    br_data.search_term = '';
    br_data.is_conversion = '';
    br_data.basket_value = '';
    br_data.order_id = '';

    window.br_data = br_data;
    this.fireTrackingPixel();
};

Bloomreach.prototype.fireTrackingPixel = function () {
    var acctId = this.options.acctId;
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type','text/javascript');
    scriptElement.setAttribute('async', true);

    scriptElement.src = 'https:' == document.location.protocol ? "https://cdns.brsrvr.com/v1/br-trk-" + acctId + ".js" : "http://cdn.brcdn.com/v1/br-trk-" + acctId + ".js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptElement, s);
};
