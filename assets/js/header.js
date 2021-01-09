if (window.hasOwnProperty('Type')) {
    Type.registerNamespace('fluentui');
} else {
    window.fluentui = window.fluentui || {};
}

fluentui.header = (function () {

    /**
     * Flag to identify if callout actions is already open
     */
    var _actionsCallout = false;

    /**
     * Scroll position when one limit is reached
     */
    var _wrapperScroll;

    /**
     * Scroll Flag to determine if scrolling Up or Down
     */
    var _scrollDirection = 0;

    /**
     * Manage Social Sharing Callout opening
     */
    var _shareToCallout = false;

    /**
     * List of social network sharing retrive from HTML Header (see header.hbs)
     */
    var _shareLinkCalloutBuilt;

    /**
     * State of the scroll to top button (disabled by default)
     */
    var _scrollToTopDisabled = true;

    /**
     * Start scroll position
     */
    var _scrollStart;

    /**
     * Change scroll position for smooth scrolling
     */
    var _scrollChange;

    /**
     * Tim eused to create a smooth scroll
     */
    var _scrollCurrentTime;

    /**
     * Table of Ccontents object
     */
    var _tocObject = null;

    /**
     * Manage Header Layouts
     */
    function headerLayout() {
        if ('undefined' !== typeof fluent_headerLayout && null != fluent_headerLayout) {
            switch (fluent_headerLayout) {
                case 'extended':
                    extendedHeaderLayout();
                    break;
            }
        }
    }

    /**
     * Header Layout - Extended
     */
    function extendedHeaderLayout() {
        var hNav = document.querySelector('#siteHeader .ms-HorizontalNav');
        var hActions = document.querySelector('#siteHeader .sideActionsSiteWrapper .actionsSubcell');
        var headerArea = document.querySelector('#siteHeader');
        var hRow = document.querySelector('#siteHeader div[class^=siteHeaderRow]');
        if (headerArea && hNav && hActions) {
            toggleClass(hRow, 'extended');
            var extendedNavRow = document.createElement('div');
            extendedNavRow.className = 'bottomNavRow';
            var cpNav = hNav.cloneNode(true);
            extendedNavRow.appendChild(cpNav);
            var cpHActions = hActions.cloneNode(true);
            extendedNavRow.appendChild(cpHActions);
            hRow.parentNode.insertBefore(extendedNavRow, hRow.nextSibling);
        }
    }

    /**
     * Build Responsive Left Navigation
     */
    function navResponsive() {
        var btnNav = document.querySelector('#siteHeader .leftNavToggleButton');
        if (btnNav) {
            btnNav.addEventListener('click', function () {
                var existPanel = document.getElementById('spLeftNav');
                if (!existPanel) {
                    var navPanel = new Panel('');
                    var hNav = document.querySelector('#siteHeader .ms-HorizontalNav');
                    var cpNav = hNav.cloneNode(true);
                    toggleClass(cpNav, 'ms-slideRightIn40');
                    navPanel.id = 'spLeftNav';
                    navPanel.className = 'ms-slideRightIn10';
                    navPanel.isOnRightSide = false;
                    navPanel.content = cpNav;
                    navPanel.isLightPanel = true;
                    navPanel.width = '272px';
                    document.body.appendChild(navPanel.render());
                }
            });
        }
    }

    /**
     * Build Responsive Callout for Actions
     */
    function sideActionsSite() {
        var calloutActionsBtn = document.querySelector('#siteHeader .sideActionsSiteWrapper .moreActionsButton button');
        if (calloutActionsBtn) {
            calloutActionsBtn.addEventListener('click', function (evt) {
                var hActions = document.querySelectorAll('#siteHeader .sideActionsSiteWrapper .actionsSubcell > *');
                if (hActions && !_actionsCallout) {
                    _actionsCallout = true;
                    var actionsList = document.createElement('ul');
                    for (var e = 0; e < hActions.length; e++) {
                        var a = document.createElement('li');
                        a.className = 'contextualMenu-item';
                        a.appendChild(hActions[e].cloneNode(true));
                        actionsList.appendChild(a);
                    }
                    actionsList.className = 'contextualMenu-list';
                    var actionsCallout = new Callout(function () {
                        _actionsCallout = false;
                    });
                    actionsCallout.className = 'ms-scaleUpIn100';
                    actionsCallout.isLightCallout = true;
                    actionsCallout.content = actionsList;
                    var calloutElem = actionsCallout.render();
                    calloutElem.style.right = 0;
                    this.appendChild(calloutElem);
                }
            });
        }
    }

    /**
     * Manage Shy Header Visibility
     */
    function shyHeaderEvent() {
        var wrapper = document.querySelector('.site-wrapper');
        if (wrapper) {
            _wrapperScroll = wrapper.scrollTop;
            wrapper.addEventListener('scroll', function (evt) {
                var w = evt.target;
                var h = document.getElementById('siteHeader');
                if (0 == w.scrollTop) { /* At the top of the page */
                    _wrapperScroll = wrapper.scrollTop;
                    if (hasClass(h, 'shyHeader')) { toggleClass(h, 'shyHeader'); }
                } else if ((w.scrollHeight - w.clientHeight) == w.scrollTop) { /* At the bottom of the page */
                    _wrapperScroll = wrapper.scrollTop;
                    if (!hasClass(h, 'shyHeader')) { toggleClass(h, 'shyHeader'); }
                } else {
                    if (_scrollDirection < w.scrollTop) { /* Scroll Down */
                        if ((wrapper.scrollTop - _wrapperScroll) >= 250) {
                            _wrapperScroll = wrapper.scrollTop;
                            if (!hasClass(h, 'shyHeader')) { toggleClass(h, 'shyHeader'); }
                        }
                    } else { /* Scroll Up */
                        if (((_wrapperScroll - wrapper.scrollTop) >= 100 || (_wrapperScroll - wrapper.scrollTop) <= -100)) {
                            _wrapperScroll = wrapper.scrollTop;
                            if (hasClass(h, 'shyHeader')) { toggleClass(h, 'shyHeader'); }
                        }
                    }
                    _scrollDirection = w.scrollTop;
                }
            });
        }
    }

    /**
     * Render Page Command bar is it is a Page or a Post
     */
    function pageCommandBar() {
        var commandBarContainer = document.getElementsByClassName('p-commandBar');
        if (commandBarContainer[0]) {
            var sharedAction = commandBarContainer[0].querySelector('[data-automation-id="shareButton"]');
            if (sharedAction) {
                sharedAction.addEventListener('click', shareEvent);
            }
            var tocAction = commandBarContainer[0].querySelector('[data-automation-id="tocButton"]');
            if (tocAction) {
                tocAction.addEventListener('click', tocEvent);
            }
            var scrollAction = commandBarContainer[0].querySelector('[data-automation-id="scrollToTopButton"]');
            if (scrollAction) {
                var wrapper = document.querySelector('.site-wrapper');
                if (wrapper) {
                    wrapper.addEventListener('scroll', function () {
                        if (wrapper.scrollTop > (wrapper.scrollHeight / 3)) {
                            if (_scrollToTopDisabled) {
                                _scrollToTopDisabled = false;
                                scrollAction.removeAttribute('disabled');
                            }
                        } else {
                            if (!_scrollToTopDisabled) {
                                _scrollToTopDisabled = true;
                                scrollAction.disabled = true;
                            }
                        }
                    });
                }
                scrollAction.addEventListener('click', scrollToTopEvent);
            }
        }
    }

    /**
     * Command bar Action to Share Page
     */
    function shareEvent() {
        if (!_shareToCallout) {
            _shareToCallout = true;
            var socialList = document.querySelector('.commandBarWrapper>ul');
            if (socialList && !_shareLinkCalloutBuilt) {
                socialList.removeAttribute('style');
                var shareCallout = new Callout(function () {
                    _shareToCallout = false;
                });
                _shareLinkCalloutBuilt = socialList;
                shareCallout.className = 'ms-scaleUpIn100';
                shareCallout.isLightCallout = true;
                shareCallout.content = socialList;
                var calloutElem = shareCallout.render();
                calloutElem.style.zIndex = 100;
                this.appendChild(calloutElem);
            } else if (!socialList && _shareLinkCalloutBuilt) {
                var shareCallout = new Callout(function () {
                    _shareToCallout = false;
                });
                shareCallout.className = 'ms-scaleUpIn100';
                shareCallout.isLightCallout = true;
                shareCallout.content = _shareLinkCalloutBuilt;
                var calloutElem = shareCallout.render();
                calloutElem.style.zIndex = 100;
                this.appendChild(calloutElem);
            }
        }
    }

    /**
     * Command Bar Action to open table of Contents
     */
    function tocEvent() {
        var toc = document.getElementById('p-tocPanel');
        if (!toc) {
            if (null == _tocObject) {
                _tocObject = buildNavigation();
            }
            var tocNav = document.createElement('ul');
            tocNav.className = 'ms-slideLeftIn40';
            var render = renderTOC(tocNav, _tocObject[0].links, 0);
            var tocPanel = new Panel('Table of contents');
            tocPanel.id = 'p-tocPanel';
            tocPanel.className = 'ms-slideLeftIn10';
            tocPanel.content = render;
            tocPanel.isLightPanel = true;
            tocPanel.width = '272px';
            document.body.appendChild(tocPanel.render());
        }
    }

    /**
     * Command Bar Action to Scroll to Top at the page
     */
    function scrollToTopEvent() {
        var wrapper = document.querySelector('.site-wrapper');
        if (wrapper) {
            _scrollStart = wrapper.scrollTop;
            _scrollChange = 0 - _scrollStart;
            _scrollCurrentTime = 0;
            animateScroll();
        }
    }

    /**
     * @see https://gitlab.lsonline.fr/SharePoint/sp-dev-fx-webparts/toc
     */
    function buildNavigation(root, parent, headers, index) {
        if (!parent) {
            parent = [];
        }
        /* init / first build */
        if (!index) {
            index = 0;
        }
        if (!headers && index == 0) {
            var sections = document.querySelectorAll('.site-content>article>section');
            if (sections) {
                headers = [];
                for (var s = 0; s < sections.length; s++) {
                    var selectedHeaders = sections[s].querySelectorAll('H2, H3, H4');
                    if (selectedHeaders) {
                        for (var h = 0; h < selectedHeaders.length; h++) {
                            if (selectedHeaders[h].id) {
                                headers.push(selectedHeaders[h]);
                            }
                        }
                    }
                }
                root = [{ links: [] }];
            }
        }
        /* Create tree */
        if (index < headers.length) {
            root = sortHeaders(root, parent, headers, index);
        }
        /* Add lastest header */
        if (headers && index == headers.length - 1) {
            if (parent['H2']) {
                root[0].links.push(parent['H2']);
            } else if (parent['H3']) {
                root[0].links.push(parent['H3']);
            } else if (parent['H4']) {
                root[0].links.push(parent['H4']);
            }
        }
        return root;
    }

    /**
     * @see https://gitlab.lsonline.fr/SharePoint/sp-dev-fx-webparts/toc
     */
    function sortHeaders(root, parent, headers, index) {
        var node = { name: (headers[index].innerText), url: '#' + headers[index].id, key: headers[index].id, isExpanded: true, links: [] };
        switch (headers[index].tagName) {
            case 'H2':
                if (parent['H2']) {
                    root[0].links.push(parent['H2']);
                }
                parent['H2'] = node;
                parent['H3'] = null;
                parent['H4'] = null;
                root = buildNavigation(root, parent, headers, index + 1);
                break;
            case 'H3':
                parent['H3'] = node;
                if (parent['H2']) {
                    parent['H2']['links'].push(parent['H3']);
                } else {
                    root[0].links.push(parent['H3']);
                }
                parent['H4'] = null;
                root = buildNavigation(root, parent, headers, index + 1);
                break;
            case 'H4':
                parent['H4'] = node;
                if (parent['H3']) {
                    parent['H3']['links'].push(parent['H4']);
                } else if (parent['H2']) {
                    parent['H2']['links'].push(parent['H4']);
                } else {
                    root[0].links.push(parent['H4']);
                }
                root = buildNavigation(root, parent, headers, index + 1);
                break;
        }
        return root;
    }

    /**
     * Render the page Header as unordered or ordered HTML list
     * @param {HTMLElement} p Unordered or ordered HTML list
     * @param {Object} o Builded Navigation function buildNavigation()
     * @param {number} i Object index for recursive function
     */
    function renderTOC(p, o, i) {
        if (o[i]) {
            var node = document.createElement('li');
            var link = document.createElement('a');
            link.href = o[i].url;
            link.innerText = o[i].name;
            link.target = '_self';
            node.appendChild(link);
            if (o[i].links.length > 0) {
                var subNodes = document.createElement('ul');
                node.appendChild(renderTOC(subNodes, o[i].links, 0));
            }
            p.appendChild(node);
            if (o[i+1]) {
                p = renderTOC(p, o, i+1);
            }
        }
        return p;
    }

    /**
     * Add a smoothly scroll effect to top
     */
    function animateScroll() {
        _scrollCurrentTime += 20;
        var val = easeInOutQuad(_scrollCurrentTime, _scrollStart, _scrollChange, 1000);
        var wrapper = document.querySelector('.site-wrapper');
        if (wrapper) {
            wrapper.scrollTop = val;
        }
        if (_scrollCurrentTime < 1000) {
            setTimeout(function() {
                animateScroll();
            }, 20);
        }
    }

    /**
     * Calc the effect to easy In/Out scroll
     * @param {number} t Current time
     * @param {number} b Start from page position
     * @param {number} c Distance between the start and the top of the page
     * @param {number} d Duration of scroll
     */
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) { return (c / 2 * t * t + b); };
        t--;
        return (-c / 2 * (t * (t - 2) - 1) + b);
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

    return {
        init: function () {
            headerLayout();
            navResponsive();
            sideActionsSite();
            shyHeaderEvent();
            pageCommandBar();
        }
    };
})();

document.addEventListener('DOMContentLoaded', fluentui.header.init());