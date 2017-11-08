(function () {
    'use strict';

    angular.module('core')
        .directive('optionClassExpr', function ($compile, $parse) {
            var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

            return {
                restrict: 'A',
                link: function optionClassExprPostLink(scope, elem, attrs) {
                    var optionsExp = attrs.ngOptions;
                    if (!optionsExp) return;

                    var match = optionsExp.match(NG_OPTIONS_REGEXP);
                    if (!match) return;

                    var values = match[7];

                    scope.$watchCollection(function () {
                        return elem.children();
                    }, function (newValue) {
                        angular.forEach(newValue, function (child) {
                            var child = angular.element(child);
                            var val = child.val().slice(7,14);
                            switch (val) {
                                case "#0459ff":
                                    child.attr('ng-class', values + '[' + 0 + '].' +
                                    attrs.optionClassExpr);
                                     $compile(child)(scope);
                                    break;
                                case "#0afc31":
                                    child.attr('ng-class', values + '[' + 1 + '].' +
                                    attrs.optionClassExpr);
                                    $compile(child)(scope);
                                    break;
                                case "#ff000f":
                                    child.attr('ng-class', values + '[' + 2 + '].' +
                                    attrs.optionClassExpr);
                                    $compile(child)(scope);
                                    break;
                            }
                            
                        });
                    });
                }
            };
        });
}());