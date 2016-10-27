(function() {
  const LocalStorage = function ($window) {
    var NAMESPACE = 'todos-';

    return {
      setObject: function (key, value) {
        $window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
      },
      getObject: function (key, defaultValue) {
        var stringifiedObject = $window.localStorage.getItem(NAMESPACE + key);
        var data = null;

        try {
          data = JSON.parse(stringifiedObject);
        } catch (e) {
          console.log(e);
        }

        return data || defaultValue;
      },
      remove: function (key) {
        $window.localStorage.removeItem(NAMESPACE + key);
      }
    };
  };

  LocalStorage.$inject = ['$window'];

  angular.module('todo').service('localStorage', LocalStorage);
})();