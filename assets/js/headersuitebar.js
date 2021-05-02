if (window.hasOwnProperty('Type')) {
    Type.registerNamespace('fluentui');
} else {
    window.fluentui = window.fluentui || {};
}

fluentui.headersuitebar = (function () {

    /**
     * Flag to determine if the user is typing a search
     */
    var _searchTyping = false;

    /**
     * Search bar event function
     */
    var _searchBarEnabledEvent;

    /**
     * Social links callout opened
     */
    var _socialCallout = false;

    /**
     * Get Cookie value by name
     * @param {*} cookieName 
     */
    function getCookieByName(cookieName) {
        var name = cookieName + '=';
        var allCookieArray = document.cookie.split(';');
        for (var i = 0; i < allCookieArray.length; i++) {
            var temp = allCookieArray[i].trim();
            if (temp.indexOf(name) == 0)
                return temp.substring(name.length, temp.length);
        }
        return '';
    }

    /**
     * Add event listener on theme buttons to update cookie theme value
     */
    function addBtnThemeEventListener() {
        var lightThemeBtn = document.querySelector('#MainLink_LightTheme_container>button');
        var darkThemeBtn = document.querySelector('#MainLink_DarkTheme_container>button');
        if (lightThemeBtn) {
            lightThemeBtn.addEventListener('click', function () {
                document.cookie = 'dark-theme=false;path=/';
                fluentui.headersuitebar.updateTheme();
            });
        }
        if (darkThemeBtn) {
            darkThemeBtn.addEventListener('click', function () {
                document.cookie = 'dark-theme=true;path=/';
                fluentui.headersuitebar.updateTheme();
            });
        }
    }

    /**
     * Manage Clear Search Button visibility
     * @param {boolean} d True to show the clear button, false to hide it
     */
    function clearBtnVisibility(d) {
        clearBtn = document.querySelector('#searchBoxRegion .clearSearch');
        if (clearBtn && true == d) {
            clearBtn.style.display = 'inline-block';
            _searchTyping = true;
        } else if (clearBtn && false == d) {
            clearBtn.style.display = 'none';
            _searchTyping = false;
        }
    }

    /**
     * Manage Search Clear Button events
     */
    function searchClearBtnEvent() {
        var searchInput = document.querySelector('#SuiteBarSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                if (!_searchTyping && 0 < e.target.value.length) {
                    clearBtnVisibility(true);
                } else if (_searchTyping && 0 == e.target.value.length) {
                    clearBtnVisibility(false);
                }
            });
        }
        var searchform = document.querySelector('#searchBoxRegion');
        if (searchform) {
            searchform.addEventListener('reset', function () {
                clearBtnVisibility(false);
            });
        }
    }

    /**
     * Open/Close Apps Panel
     */
    function appsBtnEvent() {
        var headerAppsBtn = document.querySelector('#HeaderLeftRegion>div>.apps-button');
        if (headerAppsBtn) {
            headerAppsBtn.addEventListener('click', function (e) {
                var htmlAppsPanel = document.querySelector('#appLauncherPanel');
                if (!htmlAppsPanel) {
                    var appsPanel = new Panel('My Applications', function () {
                        toggleClass(('BUTTON' == e.target.tagName ? e.target : e.target.parentNode), 'activeButton');
                    });
                    appsPanel.id = 'appLauncherPanel';
                    appsPanel.className = 'ms-slideRightIn20 ms-slideDownIn20';
                    appsPanel.isOnRightSide = false;
                    appsPanel.content = buildAppsPanelTiles();
                    appsPanel.isLightPanel = true;
                    document.body.appendChild(appsPanel.render());
                    toggleClass(('BUTTON' == e.target.tagName ? e.target : e.target.parentNode), 'activeButton');
                }
            });
        }
    }

    /**
     * Create HTML Array of Tiles
     * @returns {HTMLElement} Tiles
     */
    function buildAppsPanelTiles() {
        if ('undefined' !== typeof appsLauncherList && null != appsLauncherList && 0 < appsLauncherList.length) {
            var appsList = document.createElement('div');
            appsList.className = 'appsLaunch-appsList';
            for (var a = 0; a < appsLauncherList.length; a++) {
                var app = buildTile(appsLauncherList[a]);
                if (null != app) {
                    appsList.appendChild(app);
                }
            }
            return appsList;
        } else {
            var noAppText = document.createElement('div');
            noAppText.className = 'appsLaunch-noAppText';
            noAppText.innerText = 'No app available.';
            return noAppText;
        }
    }

    /**
     * Create HTML Tile Element
     * @param {Object} app JSON Tile
     * @returns {HTMLElement} Tile
     */
    function buildTile(app) {
        if (app.id && app.title && app.url) {
            var link = document.createElement('a');
            var imgContainer = document.createElement('div');
            var icon;
            if (!app.fluentIcon && app.icon) {
                icon = document.createElement('img');
                icon.src = app.icon;
            } else if (app.fluentIcon && !app.icon) {
                icon = document.createElement('span');
                icon.className = 'ms-Icon ms-Icon--' + app.fluentIcon;
            } else {
                icon = document.createElement('span');
                icon.className = 'ms-Icon ms-Icon--AppIconDefault';
            }
            if (app.color) {
                icon.style.color = app.color;
            }
            imgContainer.className = 'appTileImg';
            imgContainer.appendChild(icon);
            link.appendChild(imgContainer);
            var title = document.createElement('div');
            title.innerText = app.title;
            title.className = 'neutral-dark-font appTileTitle';
            link.appendChild(title);
            link.id = app.id;
            link.href = app.url;
            link.target = '_blank';
            link.role = 'link';
            link.setAttribute('aria-label', app.title);
            var c = document.createElement('div');
            c.appendChild(link);
            return c;
        } else {
            return null;
        }
    }

    /**
     * Toggle CSS class on specified HTML Element
     * @param {HTMLElement} el HTML Element to toggle CSS Class
     * @param {string} cls CSS Class name
     */
    function toggleClass(el, cls) {
        if (hasClass(el, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className = el.className.replace(reg, ' ').trim();
        } else {
            el.className = (el.className + ' ' + cls).trim();
        }
    }

    /**
     * Specified HTML Element has CSS class name
     * @param {HTMLElement} el HTML Element to toggle CSS Class
     * @param {string} cls CSS Class name
     * @returns True if HTML Element has specified CSS Class Name, else False
     */
    function hasClass(el, cls) {
        try {
            return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') === -1 ? false : true;
        } catch (hc) {
            return false;
        }
    }

    /**
     * Add Mobile event behaviors
     */
    function mobileEventListener() {
        var mSearch = document.getElementById('MobileSearchButton');
        if (mSearch) {
            mSearch.addEventListener('click', function () {
                var sbxArea = document.getElementById('searchBoxRegion');
                if (sbxArea) { toggleClass(sbxArea, 'mobile'); }
                setTimeout(function () { /* Wait before add eventListener else the panel will be close immediatly */
                    document.addEventListener('click', _searchBarEnabledEvent = mobileCloseSearchBarEventListener.bind(this));
                }, 100);
            });
        }
    }

    /**
     * Build Responsive Callout for social links
     */
    function responsiveSocial() {
        var checkSocialArea = document.querySelectorAll('#HeaderSuiteBar #topButtonsRegion #HeaderButtonRegion_Social a');
        var socialCalloutBtn = document.querySelector('#HeaderSuiteBar #topButtonsRegion #MainLink_MobileButtons_container button');
        /* Check if social links and callout buutton are available */
        if (checkSocialArea && checkSocialArea.length > 0 && socialCalloutBtn) {
            socialCalloutBtn.addEventListener('click', function (evt) {
                /* Get the social links */
                var socialArea = document.querySelectorAll('#HeaderSuiteBar #topButtonsRegion #HeaderButtonRegion_Social a');
                if (!_socialCallout) { /* Ensure callout was not already open */
                    _socialCallout = true;
                    /* Create contextualMenu */
                    var socialList = document.createElement('ul');
                    for (var e = 0; e < socialArea.length; e++) {
                        var a = document.createElement('li');
                        a.className = 'contextualMenu-item';
                        var link = socialArea[e].cloneNode(true);
                        link.innerHTML = '<span>' + socialArea[e].innerHTML + '</span><span>' + socialArea[e].title + '</span>';
                        a.appendChild(link);
                        socialList.appendChild(a);
                    }
                    socialList.className = 'contextualMenu-list';
                    /* Create callout and add contextual menu into it */
                    var socialCallout = new Callout(function () {
                        _socialCallout = false;
                    });
                    socialCallout.className = 'ms-scaleUpIn100';
                    socialCallout.isLightCallout = true;
                    socialCallout.content = socialList;
                    socialCallout.id = 'socialCallout';
                    var calloutElem = socialCallout.render();
                    calloutElem.style.top = '48px';
                    calloutElem.style.right = 0;
                    calloutElem.style.zIndex = 100;
                    this.appendChild(calloutElem);
                }
            });
        } else if ((!checkSocialArea || checkSocialArea.length < 1 ) && socialCalloutBtn) {
            /* If not social links available and callout button exist, hide it */
            socialCalloutBtn.parentNode.style.display = 'none';
        }
    }

    function mobileCloseSearchBarEventListener(evt) {
        var searchPopup = document.getElementById('ghost-fluentui-search-popup'),
            searchBox = document.getElementById('searchBoxRegion'),
            targetElement = evt.target;
        if (searchPopup || searchBox) {
            do {
                if ((searchPopup && targetElement == searchPopup) || (searchBox && targetElement == searchBox)) {
                    return;
                }
                targetElement = targetElement.parentNode;
            } while (targetElement);
            var sbxArea = document.getElementById('searchBoxRegion');
            if (sbxArea) { toggleClass(sbxArea, 'mobile'); }
            document.removeEventListener('click', _searchBarEnabledEvent, false);
        }
    }

    function initSearchConnector() {
        var sc = new SearchConnectors();
        sc.onResultsDismiss = function () {
            var sbxArea = document.getElementById('searchBoxRegion');
            if (sbxArea && hasClass(sbxArea, 'mobile') && _searchBarEnabledEvent) { 
                document.removeEventListener('click', _searchBarEnabledEvent, false);
            }
            /* case if _searchBarEnabledEvent is not defined */
            if (sbxArea && hasClass(sbxArea, 'mobile')) { 
                toggleClass(sbxArea, 'mobile');
            }
        }; 
    }

    /**
     * Add/Update theme attribute to HTML node
     */
    function setDocTheme() {
        if (getCookieByName('dark-theme') && 'false' == getCookieByName('dark-theme')) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (getCookieByName('dark-theme') && 'true' == getCookieByName('dark-theme')) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    /**
     * Display member initials behind the member image when the member is logged in 
     */
    function memberInitials() {
        var name = document.getElementById('MainLink_MeHiddenName');
        if (name) {
            var initialsElem = document.getElementById('MainLink_MeInitials');
            if (initialsElem) {
                var words = name.innerText.trim().split(' ');
                var letterOne = words[0].charAt(0);
                var letterTwo = words.length > 1 ? words[words.length - 1].charAt(0) : '';
                var initialDisplayed = letterOne + '' + letterTwo;
                initialsElem.innerText = initialDisplayed;
            }
        }
    }

    return {
        init: function () {
            _appsPanelListener = false;
            memberInitials();
            setDocTheme();
            addBtnThemeEventListener();
            searchClearBtnEvent();
            appsBtnEvent();
            mobileEventListener();
            initSearchConnector();
            responsiveSocial();
        },
        updateTheme: function () {
            setDocTheme();
        }
    };
})();

document.addEventListener('DOMContentLoaded', fluentui.headersuitebar.init());