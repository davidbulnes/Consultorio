'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.min.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/moment/min/moment-with-locales.min.js',
        'public/lib/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',  
        'public/lib/angular-animate/angular-animate.min.js',
        //'public/lib/angular-aria/angular-aria.min.js',
        'modules/core/client/js/angular-aria/angular-aria.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/interactjs/dist/interactjs.min.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/lib/konva/konva.min.js',
        'public/lib/angular-pintura/angular-pintura.min.js',
        //'public/lib/angular-material/angular-material.min.js',
        'modules/core/client/js/angular-material/angular-material.min.js',
        'public/lib/angular-data-grid/dist/pagination.min.js',
        'public/lib/angular-data-grid/dist/dataGrid.min.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
