(function() {
  const FromNowFilter = function() {
    return function(value) {
      return moment.unix(value).fromNow();
    }
  };

  FromNowFilter.$inject = [];

  angular.module('todo').filter('fromNow', FromNowFilter);
})();