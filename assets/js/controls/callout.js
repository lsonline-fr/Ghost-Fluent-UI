var Callout = (function () {

    /**
     * Additional CSS Class Names
     */
    var _className;

    /**
     * HTML Content of the Callout
     */
    var _content;

    /**
     * Specific Id of the callout
     */
    var _id;

    /**
     * Identify if the Callout is light dismiss or not
     */
    var _lightDismiss;

    /**
     * Callback used onDismiss Callout
     */
    var _onDismiss;

    /**
     * Current HTML Callout
     */
    var _callout;

    /**
     * Constructor
     * @param {string} hText Header Text of the panem
     * @param {string} className CSS Class Name of the Callout
     */
    function Callout(onDismiss) {
        _className = 'callout-base neutral-lighterAlt-background';
        _content = null;
        _callout = null;
        _id = '';
        _lightDismiss = false;
        _dismissFunc = null;
        _onDismiss = onDismiss ? onDismiss : null;
    }
    Object.defineProperty(Callout.prototype, "className", {
        /**
         * Get the CSS Class
         * @returns CSS Class of the Callout
         */
        get: function () {
            return _className;
        },
        /**
         * Set the CSS Class
         */
        set: function (value) {
            _className = value ? 'callout-base neutral-lighterAlt-background ' + value : 'callout-base neutral-lighterAlt-background';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "id", {
        /**
         * Get the ID of the Callout
         * @returns ID of the Callout
         */
        get: function () {
            return _id;
        },
        /**
         * Set the ID of the Callout
         */
        set: function (value) {
            _id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "content", {
        /**
         * Get the Callout content
         * @returns HTML Content of the Callout
         */
        get: function () {
            return _content;
        },
        /**
         * Set the HTML Content of the Callout
         */
        set: function (value) {
            _content = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "isLightCallout", {
        /**
         * Get if the Callout is light dismiss or not
         * @returns True if light dismiss, else false
         */
        get: function () {
            return _lightDismiss;
        },
        /**
         * Set true to light Callout, else false
         */
        set: function (value) {
            _lightDismiss = value;
        },
        enumerable: true,
        configurable: true
    });
    Callout.prototype.render = function () {
        var _this = this;
        var p = document.createElement('div');
        p.className = _className;
        p.id = _id;
        var main = document.createElement('div');
        main.className = 'callout-main';
        if (null != _content) { main.appendChild(_content); }
        p.appendChild(main);
        _callout = p;
        if (_lightDismiss) {
            setTimeout(function () { /* Wait before add eventListener else the Callout will be close immediatly */
                document.addEventListener('click', _this.lightDismiss.bind(null, _callout, _onDismiss, _this, this), {once: true});
            }, 100);
        }
        return _callout;
    };

    /**
     * Light Dismiss Callout
     * @param {HTMLElement} c Callout to dismiss
     * @param {*} d Dismiss function callback
     * @param {Callout} ctx Current Calout context
     * @param {Window} n Window Event
     * @param {MouseEvent} evt All mouse events of the documentDOM
     */
    Callout.prototype.lightDismiss = function (c, d, ctx, n, evt) {
        var targetElement = evt.target;
        do {
            if (targetElement == c) {
                document.addEventListener('click', ctx.lightDismiss.bind(null, c, d, ctx, n), {once: true});
                return;
            }
            targetElement = targetElement.parentNode;
        } while (targetElement);
        c.remove();
        if (d) { d(true); }
    };

    return Callout;
})();