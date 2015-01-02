
angular
  .module('tl')
  .service('tl.metric.service', ['tl.service', 'tl.metric.resource', function(Service, Metric){

    var MetricService = Service.extend(Metric);

    MetricService.prototype.availableMetrics = function(success, error) {
      return Metric.available({}, success, error);
    };

    MetricService.prototype.queryMetrics = function(metrics, period, range, options, success, error) {
      if (arguments.length < 6) {
        error = success;
        success = options;
        options = null;
      }

      var query = {
        metric: metrics,
        period: period,
        start: range[0].getTime(),
        end: range[1].getTime()
      }

      if (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          query[key] = options[key];
        }
      }

      return Metric.queryMetrics(query, success, error);
    };

    return new MetricService();
  }]);