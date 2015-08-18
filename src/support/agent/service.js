angular
  .module('tl')
  .service('tl.support.agent.service', [
    'tl.service',
    'tl.support.agent.resource',
    function(Service, Agent) {
      'use strict';

      var SupportAgentService = Service.extend(Agent);

      SupportAgentService.prototype.read = function(agentId) {
        if (!agentId) throw new Error('agentId is required');

        return Agent.read({ id: agentId }).$promise;
      };

      SupportAgentService.prototype.list = function(options) {
        options = options || {};
        return Agent.list(options).$promise;
      };

      SupportAgentService.prototype.create = function(options) {
        if (!options) throw new Error('options is required');

        return Agent.create({}, options).$promise;
      };

      SupportAgentService.prototype.update = function(options) {
        if (!options) throw new Error('options is required');

        return Agent.update({}, options).$promise;
      };

      SupportAgentService.prototype.patch = function(options) {
        if (!options) throw new Error('options is required');

        return Agent.patch({}, options).$promise;
      };

      SupportAgentService.prototype.remove = function(agentId) {
        if (!agentId) throw new Error('agentId is required');

        return Agent.remove({ id: agentId }).$promise;
      };

      return new SupportAgentService();
    }
  ]);
