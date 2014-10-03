var angular = require('angular');

angular.module('angular-web.recipe', [])
  .controller('IndexController', [ '$scope', '$http', function(scope, http) {
    http.get('http://baconipsum.com/api/?type=meat-and-filler')
      .then(function(response) {
        scope.message = 'Mmmmmm...What a tasty Flapjack!';
        scope.intro = response.data.join('');
        scope.loaded = true;
      });
  }]);

angular.bootstrap(document, [ 'angular-web.recipe' ]);
