var postcss = require('postcss');

module.exports = postcss.plugin('postcss-responsive-properties', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (css, result) {
 		
        var options = options || {};
        var root = css.root();

 		css.walkRules(function(rule) {

			if (rule.selector.indexOf(":") === rule.selector.length - 1) {
			    var parentProperty = rule;

	 			rule.each(function(decl, i) {
                    if (i === 0 || decl.type === "comment") {
                        return;
                    }
	 				var selector   = decl.parent.parent.selector;
	 				var breakpoint = !isNaN(decl.prop) ? decl.prop + "px" : "$" + decl.prop;
	 				var property   = decl.parent.selector;
	 				var value      = decl.value + ";";

	 				root.append("@media screen and (min-width: " + breakpoint + ") {"+ selector + " {" + property.slice(0, -1) + ": " + value + ";" + "} }");
	 			});
	 			parentProperty.replaceWith({prop: rule.selector.slice(0, -1), value: rule.nodes[0].value + ";"});
			}
 		});
    }
});
