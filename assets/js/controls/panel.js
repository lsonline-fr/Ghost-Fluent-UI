var Panel = (function () {

    /**
     * Additional CSS Class Names
     */
    var _className;

    /**
     * HTML Content of the Panel
     */
    var _content;

    /**
     * Header text of the panel
     */
    var _headerText;

    /**
     * Specific Id of the Panel
     */
    var _id;

    /**
     * Identify if the panel is light dismiss or not
     */
    var _lightDismiss;

    /**
     * Callback used onDismiss panel
     */
    var _onDismiss;

    /**
     * Current HTML Panel
     */
    var _panel;

    /**
     * Side of the panel
     */
    var _rightSide;

    /**
     * Wisth of the panel
     */
    var _width;

    /**
     * Constructor
     * @param {string} hText Header Text of the panem
     * @param {string} className CSS Class Name of the panel
     */
    function Panel(hText, onDismiss) {
        _className = 'panel-base neutral-lighterAlt-background';
        _width = '320px';
        _headerText = hText;
        _id = '';
        _content = null;
        _rightSide = true;
        _panel = null;
        _lightDismiss = false;
        _dismissFunc = null;
        _onDismiss = onDismiss ? onDismiss : null;
    }
    Object.defineProperty(Panel.prototype, "width", {
        /**
         * Get the width of the panel
         * @returns A width value (px, %, vh, etc.)
         */
        get: function () {
            return _width;
        },
        /**
         * Set the width of the panel
         */
        set: function (value) {
            _width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "className", {
        /**
         * Get the CSS Class
         * @returns CSS Class of the panel
         */
        get: function () {
            return _className;
        },
        /**
         * Set the CSS Class
         */
        set: function (value) {
            _className = value ? 'panel-base neutral-lighterAlt-background ' + value : 'panel-base neutral-lighterAlt-background';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "id", {
        /**
         * Get the ID of the panel
         * @returns ID of the panel
         */
        get: function () {
            return _id;
        },
        /**
         * Set the ID of the panel
         */
        set: function (value) {
            _id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "headerText", {
        /**
         * Get the header
         * @returns Header text of the panel
         */
        get: function () {
            return _headerText;
        },
        /**
         * Set the Header text of the panel
         */
        set: function (value) {
            _headerText = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "content", {
        /**
         * Get the panel content
         * @returns HTML Content of the panel
         */
        get: function () {
            return _content;
        },
        /**
         * Set the HTML Content of the panel
         */
        set: function (value) {
            _content = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "isOnRightSide", {
        /**
         * Get the side of the panel
         * @returns True if the panel is on the right side, else false
         */
        get: function () {
            return _rightSide;
        },
        /**
         * Set if the panel should be on the right side or the left ones
         */
        set: function (value) {
            _rightSide = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "isLightPanel", {
        /**
         * Get if the panel is light dismiss or not
         * @returns True if light dismiss, else false
         */
        get: function () {
            return _lightDismiss;
        },
        /**
         * Set true to light panel, else false
         */
        set: function (value) {
            _lightDismiss = value;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.render = function () {
        var _this = this;
        var p = document.createElement('div');
        p.className = _rightSide ? _className : _className + ' leftSide';
        p.id = _id;
        p.style.width = _width;
        p.setAttribute('role', 'region');
        var h = document.createElement('h1');
        h.innerText = _headerText;
        p.appendChild(h);
        if (null != _content) { p.appendChild(_content); }
        _panel = p;
        if (_lightDismiss) {
            setTimeout(function () { /* Wait before add eventListener else the panel will be close immediatly */
                document.addEventListener('click', _this.lightDismiss.bind(null, _panel, _onDismiss, _this, this), { once: true });
            }, 100);
        }
        return _panel;
    };

    /**
     * Light Dismiss Panel
     * @param {HTMLElement} p Panel to dismiss
     * @param {*} d Dismiss function callback
     * @param {Panel} ctx Current Panel context
     * @param {Window} n Window Event
     * @param {MouseEvent} evt All mouse events of the documentDOM
     */
    Panel.prototype.lightDismiss = function (p, d, ctx, n, evt) {
        var targetElement = evt.target;
        do {
            if (targetElement == p) {
                document.addEventListener('click', ctx.lightDismiss.bind(null, p, d, ctx, n), { once: true });
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement);
        p.remove();
        if (d) { d(true); }
    };

    return Panel;
})();