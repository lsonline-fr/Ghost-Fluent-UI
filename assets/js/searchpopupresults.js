var SearchPopupResults = (function () {

    /**
     * Function passed as argument to remove eventListener
     */
    var _closePopupFunc;

    /**
     * Callback used onDismiss popup results
     */
    var _onDismiss;

    /**
     * Key that allow to group the results
     */
    var _grpKey;

    /**
     * Instance of the class
     */
    var _instance;

    /**
     * In accordance with the selected property, map value with an Fluent Icon
     */
    var _iconsMap;

    /**
     * Flag when the eventListener to close to results popup was defined
     */
    var _popupListener;

    /**
     * Results od the search popup
     */
    var _results;

    /**
     * Flag to display or not the number of results
     */
    var _showCountResult;

    /**
     * Template render for each node
     */
    var _template;

    /**
     * Default constructor
     */
    function SearchPopupResults(onDismiss) {
        _results = new Array;
        _grpKey = 'type';
        _template = '<a href="{{url}}"><div>{{icon}}</div><div>{{title}}</div></a>';
        _iconsMap = { "type": { "page": "Page", "post": "News", "tag": "Tag" } };
        _showCountResult = true;
        _popupListener = false;
        _onDismiss = null;
    }

    Object.defineProperty(SearchPopupResults.prototype, "results", {
        /**
         * Get the search results
         * @returns Array of results
         */
        get: function () {
            return _results;
        },
        /**
         * Set the search results
         * @template [{ "title": "", "url": "", "type": "", "thumbnail": "", ... }]
         */
        set: function (value) {
            _results = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchPopupResults.prototype, "iconsMap", {
        /**
         * Get the mapping icons
         * @returns {object} Mapping relation between Fluent UI icon a selected item property
         */
        get: function () {
            return _iconsMap;
        },
        /**
         * Set the mapping icons
         * @template { "propertyName": { "prop": "icon", "prop": "icon" } }
         */
        set: function (value) {
            _iconsMap = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchPopupResults.prototype, "groupBy", {
        /**
         * Get property used to group the results
         * @returns {string} Property name
         */
        get: function () {
            return _grpKey;
        },
        /**
         * Set property used to group the results
         */
        set: function (value) {
            _grpKey = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchPopupResults.prototype, "template", {
        /**
         * Get Template of result
         * @returns {string} Template of result
         */
        get: function () {
            return _template;
        },
        /**
         * Set Template of result
         * @param {string} value Template of result
         */
        set: function (value) {
            _template = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchPopupResults.prototype, "showCountResult", {
        /**
         * Get if number of results should be shown
         * @returns {boolean} True if counter should be render else false
         */
        get: function () {
            return _showCountResult;
        },
        /**
         * Set if number of results should be shown
         * @param {boolean} value True if number of results should be shown else false
         */
        set: function (value) {
            _showCountResult = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(SearchPopupResults.prototype, "onDismiss", {
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

    /**
     * Group and generate HTML nodes
     */
    SearchPopupResults.prototype.renderResultsGroupedBy = function () {
        var grp = {};
        for (var h = 0; h < _results.length; h++) {
            if (typeof grp[_results[h][_grpKey]] !== "undefined") {
                grp[_results[h][_grpKey]] += '<li>' + this.formatResult(_results[h]) + '</li>';
            } else {
                grp[_results[h][_grpKey]] = '<li>' + this.formatResult(_results[h]) + '</li>';
            }
        }
        return grp;
    };

    /**
     * Map the results popup with the Fluent UI icons based on the _iconsMap
     * @param {Array<Object>} result Search results
     */
    SearchPopupResults.prototype.renderResultIcon = function (result) {
        if (null != _iconsMap && null != Object.keys(_iconsMap) && 0 < Object.keys(_iconsMap).length) {
            try {
                var icon = _iconsMap[Object.keys(_iconsMap)[0]][result[Object.keys(_iconsMap)[0]]];
                return icon ? '<span class="ms-Icon ms-Icon--' + icon + '"></span>' : '';
            } catch (e) {
                return '';
            }
        }
        return '';
    };

    /**
     * Format the result in accordance with the template
     * @param {Object} d A search result
     */
    SearchPopupResults.prototype.formatResult = function (d) {
        var _this = this;
        return _template.replace(/\{{(.*?)\}}/ig, function (a, b) {
            return b == 'icon' ? _this.renderResultIcon(d) : d[b];
        });
    };

    /**
     * Close search popup results if click anywhere else than the popup
     * @param {EventListenerObject} evt Clicked element
     */
    SearchPopupResults.prototype.popupCloseEvent = function (evt) {
        var searchPopup = document.getElementById('ghost-fluentui-search-popup'),
            searchInput = document.getElementById('SuiteBarSearchInput'),
            targetElement = evt.target;
        if (searchPopup) {
            do {
                if (targetElement == searchPopup || targetElement == searchInput) {
                    return;
                }
                targetElement = targetElement.parentNode;
            } while (targetElement);
            searchPopup.remove();
            if (_onDismiss) { _onDismiss(true); }
            document.removeEventListener('click', _closePopupFunc, false);
            _popupListener = false;
        }
    };

    /**
     * Search popup render
     */
    SearchPopupResults.prototype.render = function () {
        var old = document.getElementById('ghost-fluentui-search-popup');
        if (old) { old.remove(); } /* remove previous popup results */
        var searchContainer = document.createElement('div');
        searchContainer.id = 'ghost-fluentui-search-popup';
        var searchResults = document.createElement('ul');
        searchContainer.role = 'listbox';
        var htmlListResults = this.renderResultsGroupedBy();
        if (_showCountResult) { /* Display number of results if true */
            var nbResults = document.createElement('li');
            nbResults.className = 'nb-search-popup-results';
            nbResults.role = 'option';
            nbResults.innerText = _results.length > 0 ? _results.length > 1 ? _results.length + ' matching documents' : _results.length + ' matching document' : 'No result found.';
            searchResults.appendChild(nbResults);
        }
        if (_results.length > 0) {
            for (var r in htmlListResults) {
                var lg = document.createElement('li');
                lg.role = 'option';
                var lgTitle = document.createElement('h2');
                lgTitle.className = 'search-popup-group-title ms-fontSize-18';
                lgTitle.innerText = r + 's';
                lg.appendChild(lgTitle);
                var tr = document.createElement('ul');
                tr.role = 'group';
                tr.className = 'search-popup-result-group';
                tr.innerHTML = htmlListResults[r];
                lg.appendChild(tr);
                searchResults.appendChild(lg);
            }
        }
        searchContainer.appendChild(searchResults);
        if (!_popupListener) { /* Add event listener to close the popup only if not already mapped */
            document.addEventListener('click', _closePopupFunc = this.popupCloseEvent.bind(this));
            _popupListener = true;
        }

        return searchContainer;
    };

    return {
        getInstance: function () {
            if (!_instance) {
                _instance = new SearchPopupResults();
            }
            return _instance;
        }
    };
})();