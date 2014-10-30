module.exports = function(config) {

  config.set({

    basePath: 'tests',

    frameworks: ['mocha', 'chai'],

    files: [
      '../bower_components/angular/angular.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-resource/angular-resource.js',
      '../build/tablelist.js',
      'unit/**/*.spec.js'
    ],

    reporters: ['spec'],

    port: 9876,

    colors: true,

    plugins: [
      //'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      //'karma-script-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-spec-reporter'
    ],

    client: {
      captureConsole: true,
      mocha: {
        bail: true
      }
    },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
