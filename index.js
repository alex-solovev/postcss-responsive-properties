var postcss = require('postcss');

function appendRule(atRule, r, forceAppend) {
    if (forceAppend) {
        atRule.append(r);
        return;
    }

    var createNewSelector = true;
    atRule.walkRules(function (rule) {
        if (rule.selector === r.selector) {
            rule.append(r.nodes[0]);
            createNewSelector = false;
        }
    });

    if (createNewSelector) {
        atRule.append(r);
    }
}

function createMediaRule(root, r) {
    var createNewAR = true;

    root.walkAtRules(function (atrule) {
        if (atrule.params === r.breakpoint) {
            appendRule(atrule, r);
            createNewAR = false;
        }
    });

    if (createNewAR) {
        var ar = postcss.atRule({
            type: 'atrule',
            name: 'media',
            params: r.breakpoint
        });
        appendRule(ar, r, true);
        root.append(ar);
    }
}

module.exports = postcss.plugin('postcss-responsive-properties', function () {
    return function (css) {
        var root = css.root();

        css.walkRules(function (rule) {
            if (rule.selector.indexOf(':') === rule.selector.length - 1) {

                rule.walkDecls(function (decl) {
                    if (decl.prop === '0' || decl.type === 'comment') return;

                    var r = postcss.rule({
                        type: 'rule',
                        selector: decl.parent.parent.selector,
                        breakpoint: 'screen and (min-width: ' +
                        (!isNaN(decl.prop) ?
                            parseInt(decl.prop) + 'px' :
                            decl.prop) + ')',
                        raws: {
                            semicolon: true,
                            before: rule.raws.before.replace(/\n/, '\n')
                        },
                        source: decl.source
                    });

                    r.append({
                        type: 'decl',
                        prop: decl.parent.selector.slice(0, -1),
                        value: decl.value,
                        important: decl.important
                    });

                    createMediaRule(root, r);
                });

                rule.replaceWith(postcss.decl({
                    type: 'decl',
                    prop: rule.selector.slice(0, -1),
                    value: rule.nodes[0].value,
                    important: rule.nodes[0].important
                }));
            }
        });
    };
});
