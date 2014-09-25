angular
  .module('tl')
  .service('tl.answer.service', ['tl.service', 'tl.answer.resource',
    function(Service, Answer) {

      var AnswerService = Service.extend(Answer);

      return new AnswerService();
    }
  ]);
