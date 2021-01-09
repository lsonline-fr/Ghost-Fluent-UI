if (window.hasOwnProperty('Type')) {
    Type.registerNamespace('fluentui');
} else {
    window.fluentui = window.fluentui || {};
}

fluentui.content = (function () {

    /**
     * Update images Gallery style attribute
     */
    function imgGallery() {
        var images = document.querySelectorAll('.kg-gallery-image img');
        images.forEach(function (image) {
            var container = image.closest('.kg-gallery-image');
            var width = image.attributes.width.value;
            var height = image.attributes.height.value;
            var ratio = width / height;
            container.style.flex = ratio + ' 1 0%';
        });
    }

    /**
     * Update all blockquotes in accordance with the format
     */
    function alertColor() {
        var blockq = document.getElementsByTagName('blockquote');
        if (blockq) {
            for (var b = 0; b < blockq.length; b++) {
                var grp = blockq[b].innerText.match(/^\[.*?\]/gi) || [''];
                if (null != grp[0]) {
                    switch (grp[0].toLowerCase()) {
                        case '[danger]':
                            blockq[b].className = 'is-danger';
                            blockq[b].innerHTML = blockq[b].innerHTML.replace(/^\[.*?\]/gi, '');
                            blockq[b].innerHTML = '<i class="ms-Icon ms-Icon--ErrorBadge"></i>' + blockq[b].innerHTML;
                            break;
                        case '[warning]':
                            blockq[b].className = 'is-warning';
                            blockq[b].innerHTML = blockq[b].innerHTML.replace(/^\[.*?\]/gi, '');
                            blockq[b].innerHTML = '<i class="ms-Icon ms-Icon--Warning"></i>' + blockq[b].innerHTML;
                            break;
                        case '[success]':
                            blockq[b].className = 'is-success';
                            blockq[b].innerHTML = blockq[b].innerHTML.replace(/^\[.*?\]/gi, '');
                            blockq[b].innerHTML = '<i class="ms-Icon ms-Icon--Lightbulb"></i>' + blockq[b].innerHTML;
                            break;
                        case '[info]':
                            blockq[b].className = 'is-info';
                            blockq[b].innerHTML = blockq[b].innerHTML.replace(/^\[.*?\]/gi, '');
                            blockq[b].innerHTML = '<i class="ms-Icon ms-Icon--Info"></i>' + blockq[b].innerHTML;
                            break;
                        case '[note]':
                            blockq[b].innerHTML = blockq[b].innerHTML.replace(/^\[.*?\]/gi, '');
                            blockq[b].innerHTML = '<i class="ms-Icon ms-Icon--Info"></i>' + blockq[b].innerHTML;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    /**
     * Add a code header above the pre tag
     */
    function codeHeader() {
        var scripts = document.querySelectorAll('pre>code');
        if (scripts) {
            for (var i = 0; i < scripts.length; i++) {
                var l = scripts[i].className.match(/language-([A-z]+)/) || ['', scripts[i].className.replace('hljs', '').trim()];
                if (null != l[1] && 'nohighlight' != l[1].toLowerCase()) {
                    var r = document.createElement('div');
                    r.className = 'codeHeader';
                    var o = document.createElement('span');
                    o.className = 'language';
                    o.innerText = l[1];
                    r.append(o);
                    var b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'action';
                    var icon = document.createElement('i');
                    icon.className = 'ms-Icon ms-Icon--Copy';
                    var btnText = document.createElement('span');
                    btnText.innerText = 'Copy';
                    b.append(icon);
                    b.append(btnText);
                    r.append(b);
                    scripts[i].parentNode.parentNode.insertBefore(r, scripts[i].parentNode);
                    b.addEventListener('click', copyCode);
                }
            }
        }
    }

    /**
     * Copy Code in accordance with the clicked button
     */
    function copyCode() {
        var pre = this.parentNode.nextSibling;
        if ('PRE' == pre.nodeName) {
            var code = pre.firstChild;
            var text = code.textContent || code.innerText;
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';  //avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            if (window.document.documentMode) {
                textArea.setSelectionRange(0, el.value.length);
            } else {
                textArea.select();
            }
            try {
                var successful = document.execCommand('copy');
            } catch (err) {
                console.log(err);
            }
            document.body.removeChild(textArea);
        }
    }

    /**
     * Add Page Headers Anchor
     */
    function headerAnchors() {
        var headers = document.querySelectorAll('h2, h3, h4, h5, h6');
        if (headers) {
            for (var h = 0; h < headers.length; h++) {
                var id = headers[h].id;
                if (id) {
                    var a = document.createElement('a');
                    a.role = 'link';
                    a.className = 'h-anchor';
                    a.href = document.location.origin + document.location.pathname.replace(/\/$/gi, '') + '#' + id;
                    a.target = '_self';
                    var icon = document.createElement('i');
                    icon.className = 'ms-Icon ms-Icon--Link';
                    a.appendChild(icon);
                    headers[h].append(a);
                }
            }
        }
    }

    /**
     * Add target attribute for external links for opening them into a new tab by default
     */
    function externalLinks() {
        var links = document.getElementsByTagName('a');
        for (l = 0; l < links.length; l++) {
            if (links[l].href.indexOf(document.location.origin) === -1) {
                if (!links[l].getAttribute('target')) {
                    links[l].target = '_blank';
                }
                if (!hasClass(links[l], 'externalLinks')) {
                    links[l].classList.add('externalLinks');
                }
            }
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
            imgGallery();
            alertColor();
            setTimeout(function () {
                codeHeader();
            }, 100);
            headerAnchors();
            externalLinks();
        }
    };
})();

document.addEventListener('DOMContentLoaded', fluentui.content.init());