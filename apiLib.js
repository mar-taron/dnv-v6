/**
 * Holds common   methods for fetching from api which are used on many pages.
 *
 * @namespace
 */
window.Vue = require('vue');
const api = require('./api'),
      auth = require('./auth');
 module.exports = {
    fetchEgress() {
        var egressess = [];
        Vue.http.get(api.getEndpointUrl() + "/v1/trunk/egress/list" ,
            {
                headers: {
                    "X-Auth-Token": auth.getToken()
                }
            }).then(function(response) {
              var ingress_lists = response.body.payload.items;
            ingress_lists.forEach(function (item, i) {
                egressess.push(item.name);
            });
        }, function(error) {
             console.log(error);
        });
        return egressess;

    },
     fetchIngress() {
         var ingresses = [];
          Vue.http.get(api.getEndpointUrl() + "/v1/trunk/ingress/list" ,
            {
                headers: {
                    "X-Auth-Token": auth.getToken()
                }
            }).then(function(response) {
             //todo: check success flag? validation errors?
            var ingress_lists = response.body.payload.items;
            ingress_lists.forEach(function (item, i) {
                ingresses.push(item.name);
            });
         }, function(error) {
            console.log(error);
         });
         return ingresses;

     },

};