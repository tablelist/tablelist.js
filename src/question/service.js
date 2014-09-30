angular
  .module('tl')
  .service('tl.question.service', ['tl.question.resource', 'tl.service',
    function(Question, Service) {

      var QuestionService = Service.extend(Question);

      QuestionService.prototype.listAnswers = function(id) {
        return Question.listAnswers({
          id: id
        });
      };

      QuestionService.prototype.listTotalsForAnswers = function(id) {
        return Question.listTotalsForAnswers({
          id: id
        });
      };

      return new QuestionService();
    }
  ]);
