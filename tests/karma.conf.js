module.exports = function(config) {

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    plugins: [
      'karma-phantomjs-launcher',
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
