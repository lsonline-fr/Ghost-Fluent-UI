var Elasticsearch = (function () {

    /**
     * Elasticsearch authentication
     */
    var _auth;

    /**
     * Elasticsearch endpoint
     */
    var _endpoint;

    /**
     * Instance of the class
     */
    var _instance;

    /**
     * Limit of results returned by Elasticsearch
     */
    var _limit;

    /**
     * Searched Term
     */
    var _searchedTerm;

    /**
     * Default constructor
     * @param {string} auth Elasticsearch encoded credentials
     */
    function Elasticsearch(auth) {
        _auth = auth;
        _endpoint = '/api/search';
        _limit = 500;
        _searchedTerm = '';
        _onComplete = null;
        _onError = null;
    }

    Object.defineProperty(Elasticsearch.prototype, "auth", {
        /**
         * Get the Elasticsearch auth
         * @returns {string} Encoded base64 credentials
         */
        get: function () {
            return _auth;
        },
        /**
         * Set the Elasticsearch auth
         * @param {string} value btoa('username:password')
         */
        set: function (value) {
            _auth = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Elasticsearch.prototype, "endpoint", {
        /**
         * Get the Elasticsearch endpoint URL
         * @returns {string} Elasticsearch endpoint URL
         */
        get: function () {
            return _endpoint;
        },
        /**
         * Set the Elasticsearch endpoint URL
         * @param {string} value Elasticsearch endpoint URL
         */
        set: function (value) {
            _endpoint = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Elasticsearch.prototype, "limit", {
        /**
         * Get the Elasticsearch limit of results
         * @returns {number} Elasticsearch limit of results
         */
        get: function () {
            return _limit;
        },
        /**
         * Set the Elasticsearch limit of results
         * @param {number} value Elasticsearch limit of results
         */
        set: function (value) {
            _limit = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Elasticsearch.prototype, "query", {
        /**
         * Get the Elasticsearch query
         * @returns {object} Encoded base64 credentials
         */
        get: function () {
            return this.buildQuery();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Elasticsearch.prototype, "onComplete", {
        /**
         * Get the Elasticsearch results when request complete
         * @returns {objetc} Elasticsearch results
         */
        get: function () {
            return _onComplete;
        },
        /**
         * Set the Elasticsearch function to callback when request complete
         * @param {*} value Callback function
         */
        set: function (value) {
            _onComplete = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Elasticsearch.prototype, "onError", {
        /**
         * Get the Elasticsearch results when request error
         * @returns {object} Elasticsearch request error
         */
        get: function () {
            return _onError;
        },
        /**
         * Set the Elasticsearch function to callback when request error
         * @param {*} value Callback function
         */
        set: function (value) {
            _onError = value;
        },
        enumerable: true,
        configurable: true
    });

    /**
     * Build Elasticsearch query
     */
    Elasticsearch.prototype.buildQuery = function () {
        _query = {
            "size": _limit,
            "from": 0,
            "query": {
                "query_string": { "query": _searchedTerm, "default_operator": "AND" }
            },
            "post_filter": { "term": { "status": "published" } },
            "highlight": { "fields": { "title": {}, "custom_excerpt": {} } }
        };
        return _query;
    };

    /**
     * Send ElasticSearch request
     * @param {string} searchTerm Search term query 
     * @param {*} onComplete When Elasticsearch request return results
     * @param {*} onError When Elasticsearch return an error
     */
    Elasticsearch.prototype.search = function (searchTerm, onComplete, onError) {
        _searchedTerm = searchTerm ? searchTerm : '';
        var s = new XMLHttpRequest();
        s.open('POST', _endpoint, true);
        s.setRequestHeader("Accept", "application/json;odata=verbose");
        s.setRequestHeader("Content-Type", "application/json");
        if (_auth) {
            s.withCredentials = true;
            s.setRequestHeader("Authorization", "Basic " + _auth);
        }

        s.onreadystatechange = function () {
            var status;
            if (s.readyState == 4) { // `DONE`
                status = s.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    if (onComplete) { onComplete(JSON.parse(s.responseText)); }
                } else {
                    if (onError) { onError({ status: s.status, statusText: s.statusText, responseText: s.responseText }); }
                }
            }
        };
        s.send(JSON.stringify(this.buildQuery()));
    };

    return {
        getInstance: function (auth) {
            if (!_instance) {
                _instance = new Elasticsearch(auth);
            }
            return _instance;
        }
    };
})();