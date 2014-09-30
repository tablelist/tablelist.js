angular
  .module('tl')
  .service('tl.question.service', ['$timeout', 'tl.storage', 'tl.keychain', 'tl.ee', 'tl.question.resource', 'tl.service',
    function($timeout, storage, keychain, ee, Question, Service) {

      var QuestionService = Service.extend(Question);

      return new QuestionService();
    }
  ]);
