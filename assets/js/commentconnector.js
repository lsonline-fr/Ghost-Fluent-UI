if (window.hasOwnProperty('Type')) {
    Type.registerNamespace('fluentui');
} else {
    window.fluentui = window.fluentui || {};
}

fluentui.comment = (function () {

    /**
     * Comments service configuration
     */
    var _config;

    function constructor() {
        var cWrapper = document.getElementById('commentsWrapper');
        var pThread = document.getElementById('p-comments-thread');
        if (cWrapper && pThread) {
            if ('undefined' !== typeof comment_config && null != comment_config && comment_config.service) {
                _config = comment_config;
                switch(comment_config.service) {
                    case 'isso':
                        issoConnector();
                        break;
                    default:
                        cWrapper.remove();
                }
            } else {
                cWrapper.remove();
            }
        }
    }

    function issoConnector() {
        if (_config.url) {
            var pThread = document.getElementById('p-comments-thread');
            /* Add isso-thread ID into DOM */
            var thread = document.createElement('div');
            thread.id = 'isso-thread';
            thread.setAttribute('data-title', pThread.getAttribute('data-title'));
            pThread.appendChild(thread);
            /* Build script tag */
            var isso = document.createElement('script');
            var html = document.getElementsByTagName('html')[0];
            var lang = _config.lang ? _config.lang : html.lang;
            isso.dataset.isso = _config.url;
            isso.dataset.issoLang = lang;
            isso.dataset.issoId = pThread.getAttribute('data-comment-id');
            isso.dataset.issoRequireAuthor = _config.requireAuthor;
            isso.dataset.issoRequireEmail = _config.requireEmail;
            isso.dataset.issoReplyToSelf = _config.replyToSelf;
            isso.dataset.issoVote = _config.vote;
            isso.dataset.issoAvatar = _config.avatar;
            isso.dataset.issoGravatar = _config.gravatar;
            isso.dataset.issoReplyNotifications = _config.replyNotifications;
            var u = new URL('js/embed.min.js', _config.url);
            isso.src = u.href.replace(u.protocol, '');
            document.body.appendChild(isso);
        } else {
            var cWrapper = document.getElementById('commentsWrapper');
            if (cWrapper) {
                cWrapper.remove();
            }
        }
    }

    return {
        init: function () {
            constructor();
        }
    };
})();

document.addEventListener('DOMContentLoaded', fluentui.comment.init());