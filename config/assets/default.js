'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-material/angular-material.css',
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.min.css'
        // endbower
      ],
      js: [
        // bower:js
        
        'public/lib/angular/angular.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/moment/min/moment-with-locales.js',
        'public/lib/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',  
        'public/lib/angular-animate/angular-animate.js',
        //'public/lib/angular-aria/angular-aria.js',
       // 'modules/core/client/js/angular-aria/angular-aria.js',
        'public/lib/angular-touch/angular-touch.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'public/lib/ng-file-upload/ng-file-upload.js',      
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/interactjs/dist/interactjs.min.js',
        'public/lib/chart.js/dist/Chart.min.js',
        'public/lib/angular-chart.js/dist/angular-chart.js',
        'public/lib/konva/konva.js',
        'public/lib/angular-pintura/angular-pintura.js',
        //'public/lib/angular-material/angular-material.js',
        //'modules/core/client/js/angular-material/angular-material.js',
        'public/lib/angular-data-grid/dist/pagination.js',
        'public/lib/angular-data-grid/dist/dataGrid.js'


        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
