var postcss = require('postcss');

function createMediaRule(root, r) {
    var createNewAR = true;

    root.walkAtRules(function (atrule) {
        if (atrule.params === r.breakpoint) {
            atrule.append(r);
            createNewAR = false;
        }
    });

    if (createNewAR) {
        var ar = postcss.atRule({
            type: 'atrule',
            name: 'media',
            params: r.breakpoint
        });
        ar.append(r);
        root.append(ar);
    }
}

module.exports = postcss.plugin('postcss-responsive-properties', function () {
    return function (css) {
        var root = css.root();

        css.walkRules(function (rule) {
            if (rule.selector.indexOf(':') === rule.selector.length - 1) {

                rule.walkDecls(function (decl, i) {
                    if (i === 0 || decl.type === 'comment') return;

                    var r = postcss.rule({
                        type: 'rule',
                        selector: decl.parent.parent.selector,
                        breakpoint: 'screen and (min-width: ' +
                            (!isNaN(decl.prop) ?
                                parseInt(decl.prop) + 'px' :
                                '$' + decl.prop) + ')',
                        raws: {
                            semicolon: true
                        }
                    });
                    r.append({
                        type: 'decl',
                        prop: decl.parent.selector.slice(0, -1),
                        value: decl.value
                    });

                    createMediaRule(root, r);
                });

                rule.replaceWith({
                    type: 'decl',
                    prop: rule.selector.slice(0, -1),
                    value: rule.nodes[0].value + ';'
                });
            }
        });
    };
});
