var myApp = angular.module('todo', ['ui.router']);

myApp.config(function($stateProvider) {
  var helloState = {
    name: 'hello',
    url: '/hello',
    template: '<h3>hello world!</h3>d{{todosCtrl.hello}}b'
  };

  var aboutState = {
    name: 'about',
    url: '/about',
    template: '<h3>Its the UI-Router hello world app!</h3>'
  };

  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
  $stateProvider.state('todos', {
    url: '/todos',
    views: {
      filters: {
        template: '<div>Filters TBD</div>'
      },
      todoList: {
        resolve: {
          todos: function(sessionStore) {
            return sessionStore.getObject('todos', []);
          }
        },
        controller: 'todoListController as todoListCtrl',
        template: [
          '<form name="todoList" ng-submit="todoListCtrl.addTodo(todoList.$valid, todoListCtrl.data.item, todoListCtrl.data.dueDate)" novalidate>',
            '<fieldset>',
              '<label>Todo:</label>',
              '<input type="text" name="item" ng-model="todoListCtrl.data.item" required />',
              '<span ng-if="todoList.item.$invalid && (todoList.item.$dirty || todoList.$submitted)">Title is required</span>',
              '<input type="date" name="dueDate" ng-model="todoListCtrl.data.dueDate" />',
              '<button type="submit">+</button>',
            '</fieldset>',
          '</form>',
          '<ul ng-show="todoListCtrl.data.items.length">',
            '<li ng-repeat="todo in todoListCtrl.data.items track by $index">',
              '<div>',
                '<p ',
                  'ng-if="!todo.update"',
                  'ng-click="todoListCtrl.toggleComplete($index, todo.complete)">{{todo.item}} - {{todo.complete}}',
                '</p>',
                '<p ng-if="todo.update"> ',
                  '<input ng-model="todo.item" />',
                  '<a href="#" ng-click="todoListCtrl.updateTodo($event, $index, todo.item)">Save</a>',
                '</p>',
                '<p>',
                  'Due By: {{todo.dueDate | date}} {{todoListCtrl.today | date}}',
                  '<span ng-if="todoListCtrl.today > item.dueDate">OverDue</span>',
                '</p>',
                '<p>',
                  'Created On: {{todo.createdOn | date}}',
                '</p>',
                '<p>',
                  '<a href="#" ng-click="todoListCtrl.toggleUpdateTodo($event, $index, todo.update)">Update</a>',
                  ' - <a href="#" ng-click="todoListCtrl.deleteTodo($event, $index)">Delete</a>',
                '</p>',
              '</div>',
            '</li>',
          '</ul>'
        ].join('')
      }
    }
  });
});

// ---- Controllers

myApp
  .controller('todoListController', [
    '$scope',
    'sessionStore',
    'todos',
    function($scope, sessionStore, todos) {
      var vm = this;

      vm.today = moment().unix();

      vm.data = {
        items: todos
      };

      vm.addTodo = function(valid, todo, date) {
        console.log(date)
        if (!valid) { return; }
        var todo = {
          item: todo,
          createdOn: moment().unix(),
        };

        if (date) {
          todo.dueDate = moment(date, 'MM/DD/YYYY hh:mm a').unix();
        }

        vm.data.items.push(todo);
        vm.data.item = '';
        vm.data.dueDate = undefined;
        $scope.todoList.$setPristine();

        _saveTodos(vm.data.items);
      };

      vm.toggleComplete = function(index, complete) {
        vm.data.items[index].complete = !complete;

        _saveTodos(vm.data.items);
      };

      vm.deleteTodo = function(event, index) {
        event.preventDefault();
        vm.data.items.splice(index, 1);

        _saveTodos(vm.data.items);
      };

      vm.updateTodo = function(event, index, item) {
        event.preventDefault();
        vm.data.items[index].update = false;
        vm.data.items[index].item = item;

        _saveTodos(vm.data.items);
      };

      vm.toggleUpdateTodo = function(event, index, update) {
        event.preventDefault();

        vm.data.items[index].update = !update;
      };

      function _saveTodos(items) {
        sessionStore.setObject('todos', items);
      };
    }
  ]);

// ---- /Controllers

// ---- Directives
// ---- /Directives

// ---- Filters
myApp.filter('date', [
  '$filter',
  function($filter) {
    return function(value) {
      return moment.unix(value).format('MMM Do, YYYY')
    }
  }
]);
// ---- /Filters


// ---- Factories


myApp
  .service('sessionStore', [
    '$window',
    function ($window) {
      var NAMESPACE = 'todos-';

      return {
        setObject: function (key, value) {
          $window.sessionStorage.setItem(NAMESPACE + key, JSON.stringify(value));
        },
        getObject: function (key, defaultValue) {
          var stringifiedObject = $window.sessionStorage.getItem(NAMESPACE + key);
          var data;

          try {
            data = JSON.parse(stringifiedObject);
          } catch (e) {
            console.log(e);
          }

          return data || defaultValue;
        },
        remove: function (key) {
          $window.sessionStorage.removeItem(NAMESPACE + key);
        }
      };
    }
  ]);
// ---- /Factories
