/* globals localStorage */
/* globals sessionStorage */
const VueResource = require('vue-resource');
const api = require('./api');

module.exports = {
    apiUrl: "/v1/auth",
    //todo: intercept 403/401

    login (login, pass, permanent, cb) {
        if (this.loggedIn()) {
            this.resetToken();
        }

        Vue.http.post(api.getEndpointUrl() + this.apiUrl, {
            email_or_name: login,
            password: pass
        }).then(function(response) {
            //todo: check success flag? validation errors?
            var token = response.data.payload.token;
            var cdr_api_token = response.data.payload.cdr_api_token;
            var cdr_api_token_expiration = response.data.payload.cdr_api_token_expiration;
            var cdr_time = formatDateFromStamp(cdr_api_token_expiration);
            var type = response.data.payload.user_type;
            console.log(type);
            sessionStorage.token = token;
            sessionStorage.cdr_api_token = cdr_api_token;
            sessionStorage.user = login;
            console.log('cdr token');
            console.log(cdr_api_token);
            console.log(cdr_api_token_expiration);
            // this temporary code
            type = 'agent';
            if (login == 'admin') {
                type = 'admin';
            } else if (login == 'peterponikve') {
                type = 'client';
            }
            //
            sessionStorage.type = type;
            if (permanent) {
                localStorage.token = token;
                localStorage.cdr_api_token = cdr_api_token;
                localStorage.type = type;
            }
            if (cb) cb(true, type);
        }, function(error) {
            console.log(error);
            if (cb) cb(false, null, error.data.error.message);
        });
    },

    getToken () {
        return sessionStorage.token || localStorage.token;
    },

    getCdrToken () {
        return sessionStorage.cdr_api_token || localStorage.cdr_api_token;
    },

    getType () {
        return sessionStorage.type || localStorage.type;
    },

    resetToken() {
        delete sessionStorage.token;
        delete localStorage.token;
        delete sessionStorage.user;
        delete sessionStorage.type;
        delete localStorage.type;
        delete sessionStorage.cdr_api_token;
        delete localStorage.cdr_api_token;
    },

    logout (cb) {
        this.resetToken();
        if (cb) cb();
    },

    loggedIn () {
        return !!this.getToken();
    },

    getloggedInUser () {
        return sessionStorage.user;
    }
};