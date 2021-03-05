var SearchConnectors = (function () {

    /**
     * Callback used onRender popup results
     */
    var _onRender;

    /**
     * Callback used onDismiss popup results
     */
    var _onDismiss;

    /**
     * Can be used to managed keyup timeout
     */
    var _keyUpTimer;

    function SearchConnectors() {
        _onRender = null;
        _onDismiss = null;
        var searhcInput = document.getElementById('SuiteBarSearchInput');
        if ('undefined' !== typeof ghosthunter_key && null != ghosthunter_key && searhcInput) {
            this.preventEnter(searhcInput);
            this.ghostHunterConnector();
            this.updateJSONDL();
        } else if ('undefined' !== typeof elasticsearch_auth && null != elasticsearch_auth && searhcInput) {
            this.preventEnter(searhcInput);
            this.elasticsearchConnector(elasticsearch_auth);
            this.initSearchFromURL();
            this.updateJSONDL();
        } else {
            searhcInput.parentNode.remove();
        }
    }

    Object.defineProperty(SearchConnectors.prototype, "onResultsRender", {
        /**
         * Get the onRender event
         * @returns {*} Current onRender option
         */
        get: function () {
            return _onRender;
        },
        /**
         * Set callback for onRender event
         * @param {*} value Callback function
         */
        set: function (value) {
            _onRender = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchConnectors.prototype, "onResultsDismiss", {
        /**
         * Get the onDismiss event
         * @returns {*} Current onDismiss option
         */
        get: function () {
            return _onDismiss;
        },
        /**
         * Set callback for onDismiss event
         * @param {*} value Callback function
         */
        set: function (value) {
            _onDismiss = value;
        },
        enumerable: true,
        configurable: true
    });

    SearchConnectors.prototype.preventEnter = function (elem) {
        elem.addEventListener('keydown', function(e) {
            if (e.which == 13 || e.keyCode == 13) {
                e.preventDefault();
            }
        });
    };

    SearchConnectors.prototype.ghostHunterConnector = function () {
        var _this = this;
        $('#SuiteBarSearchInput').ghostHunter({
            results: '#GhostHunerSearchResults',
            onKeyUp: true,
            onPageLoad: true,
            onComplete: function (results) {
                var s = SearchPopupResults.getInstance();
                s.onDismiss = function () {
                    if (_onDismiss) { _onDismiss(true); }
                    _this.resetURL();
                };
                s.results = results;
                var sArea = document.querySelector('#searchBoxRegion form');
                sArea.appendChild(s.render());
                if (_onRender) { _onRender(true); }
            },
            indexing_end: function () {
                _this.initSearchFromURL();
            }
        });
    };

    SearchConnectors.prototype.elasticsearchConnector = function (auth) {
        var _this = this;
        var searchInput = document.getElementById('SuiteBarSearchInput');
        searchInput.addEventListener('keyup', function (evt) {
            clearTimeout(_keyUpTimer);
            _keyUpTimer = setTimeout(function () { /* Add delay before send request to ELK */
                var elk = Elasticsearch.getInstance(auth);
                if ('undefined' !== typeof elasticsearch_endpoint && null !== elasticsearch_endpoint) { elk.endpoint = elasticsearch_endpoint; }
                elk.search(evt.target.value,
                    function (r) {
                        var s = SearchPopupResults.getInstance();
                        var formattedResults = new Array;
                        if (r.hits.hits.length > 0) {
                            for (var i = 0; i < r.hits.hits.length; i++) {
                                var o = {
                                    id: r.hits.hits[i]._source.id,
                                    title: r.hits.hits[i]._source.title,
                                    url: new URL(r.hits.hits[i]._source.url, window._ghostPageContext.siteUrl).href,
                                    type: r.hits.hits[i]._source.type,
                                    thumbnail: r.hits.hits[i]._source.feature_image
                                };
                                if (r.hits.hits[i]['highlight'] && r.hits.hits[i]['highlight']['title']) {
                                    o.title = r.hits.hits[i]['highlight']['title'];
                                }
                                formattedResults.push(o);
                            }
                        }
                        s.onDismiss = function () {
                            if (_onDismiss) { _onDismiss(true); }
                            _this.resetURL();
                        };
                        s.results = formattedResults;
                        var sArea = document.querySelector('#searchBoxRegion form');
                        sArea.appendChild(s.render());
                        if (_onRender) { _onRender(true); }
                    },
                    function (e) {
                        console.log('elk connector error:', e);
                    });
            }, 500);
        });
    };

    /**
     * Parse URL and launch search if necessary
     */
    SearchConnectors.prototype.initSearchFromURL = function () {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var searchInput = document.getElementById('SuiteBarSearchInput');
        if (urlParams.get('q') && searchInput) {
            searchInput.value = urlParams.get('q');
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('keyup', false, true);
            searchInput.dispatchEvent(evt);
        }
    };

    /**
     * Remove search query from the URL by updating window.history
     */
    SearchConnectors.prototype.resetURL = function () {
        var u = window.location.href;
        u.replace(/\?q=(.*)/, '');
        window.history.replaceState(null, null, u.replace(/\?q=(.*)/, ''));
    };

    /**
     * Update existing Ghost JSON Link Data to add Search Engine
     */
    SearchConnectors.prototype.updateJSONDL = function () {
        var jsonLdScript = document.querySelector('script[type="application/ld+json"]');
        if (jsonLdScript) {
            var jsonldObject = JSON.parse(jsonLdScript.innerText);
            jsonldObject['potentialAction'] = {};
            jsonldObject['potentialAction'] = {
                "@type": "SearchAction",
                "target": _ghostPageContext.siteUrl + '/?q={search_term_string}',
                "query-input": "required name=search_term_string"
            };
            jsonLdScript.innerHTML = JSON.stringify(jsonldObject);
        }
    };

    return SearchConnectors;
})();