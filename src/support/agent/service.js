angular
  .module('tl')
  .service('tl.support.agent.service', [
    'tl.service',
    'tl.support.agent.resource',
    function(Service, Agent) {
      'use strict';

      var SupportAgentService = Service.extend(Agent);

      SupportAgentService.prototype.read = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        options = options || {};

        options.id = agentId;

        return Agent.read(options).$promise;
      };

      SupportAgentService.prototype.list = function(options) {
        options = options || {};
        return Agent.list(options).$promise;
      };

      SupportAgentService.prototype.create = function(options) {
        if (!options) throw new Error('options is required');

        return Agent.create({}, options).$promise;
      };

      SupportAgentService.prototype.update = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        if (!options) throw new Error('options is required');

        return Agent.update({ id: agentId }, options).$promise;
      };

      SupportAgentService.prototype.patch = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        if (!options) throw new Error('options is required');

        return Agent.patch({ id: agentId }, options).$promise;
      };

      SupportAgentService.prototype.remove = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        options = options || {};

        options.id = agentId;

        return Agent.remove(options).$promise;
      };

      return new SupportAgentService();
    }
  ]);
