if (window.hasOwnProperty('Type')) {
    Type.registerNamespace('fluentui');
} else {
    window.fluentui = window.fluentui || {};
}

fluentui.footer = (function () {

    function enableExtendMode() {
        if ('undefined' !== typeof fluent_footerLayout && 'extended' == fluent_footerLayout) {
            var fNav = document.querySelector('footer .footerLinks .nav');
            if (fNav) {
                fNav.parentNode.parentNode.className = 'extended';
                var oLinks = parseNavLinks(fNav);
                var mm = renderLinks(oLinks);
                fNav.parentNode.innerHTML = mm.outerHTML;
            }
        }
    }

    function parseNavLinks(nav) {
        var links = nav.getElementsByTagName('a');
        var oLinks = new Array;
        var order = 1;
        if (links) {
            for (var l = 0; l < links.length; l++) {
                var grp = links[l].innerText.match(/([^[]+(?=]))/gi) || [''];
                if (null != grp[0] && groupExist(oLinks, grp[0]) < 0) {
                    links[l].innerText = links[l].innerText.replace(/\[.*\]/gi, '');
                    var newLink = {
                        'group': grp[0],
                        'order': order,
                        'links': new Array(links[l])
                    };
                    order++;
                    oLinks.push(newLink);
                } else if (null != grp[0]) {
                    links[l].innerText = links[l].innerText.replace(/\[.*\]/gi, '');
                    oLinks[groupExist(oLinks, grp[0])].links.push(links[l]);
                }
            }
        }
        return oLinks;
    }

    function groupExist(a, grp) {
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].group == grp) {
                    return i;
                }
            }
        }
        return -1;
    }

    function renderLinks(links) {
        var megaMenu = document.createElement('div');
        megaMenu.className = 'megaMenu';
        var megaMenuGrid = document.createElement('div');
        megaMenuGrid.className = 'megaMenu-grid';
        for (var g = 0; g < links.length; g++) {
            var gridLayoutItem = document.createElement('div');
            gridLayoutItem.className = 'megaMenu-gridLayoutItem';
            var section = document.createElement('ul');
            section.className = 'megaMenu-section';
            var head = document.createElement('h3');
            head.innerText = links[g].group;
            section.appendChild(head);
            for (var l = 0; l < links[g].links.length; l++) {
                var item = document.createElement('li');
                item.className = 'menu-item';
                item.appendChild(links[g].links[l]);
                section.appendChild(item);
            }
            gridLayoutItem.appendChild(section);
            megaMenuGrid.appendChild(gridLayoutItem);
        }
        megaMenu.appendChild(megaMenuGrid);
        return megaMenu;
    }

    return {
        init: function () {
            enableExtendMode();
        }
    };
})();

document.addEventListener('DOMContentLoaded', fluentui.footer.init());