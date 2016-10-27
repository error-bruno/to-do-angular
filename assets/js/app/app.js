angular
  .module('todo', ['ui.router', 'mgcrea.ngStrap.datepicker'])
  .config(function($stateProvider, $urlRouterProvider) {
    var todoResolve = function(localStorage) {
      return localStorage.getObject('todos', []);
    };

    $stateProvider
      .state('todos', {
        url: '/todos',
        template: '<div ui-view="todoList"></div>'
      })
      .state('all', {
        parent: 'todos',
        url: '/all',
        views: {
          todoList: {
            resolve: {
              todos: todoResolve,
              viewFilter: function() { return {}; } 
            },
            controller: 'todoListController as todoListCtrl',
            templateUrl: '/assets/html/todo-list.html'
          }
        }
      })
      .state('active', {
        parent: 'todos',
        url: '/active',
        views: {
          todoList: {
            resolve: {
              todos: todoResolve,
              viewFilter: function() { return {complete: false}; } 
            },
            controller: 'todoListController as todoListCtrl',
            templateUrl: '/assets/html/todo-list.html'
          }
        }
      })
      .state('complete', {
        parent: 'todos',
        url: '/complete',
        views: {
          todoList: {
            resolve: {
              todos: todoResolve,
              viewFilter: function() { return {complete: true}; }
            },
            controller: 'todoListController as todoListCtrl',
            templateUrl: '/assets/html/todo-list.html'
          }
        }
      });

    $urlRouterProvider.otherwise('/todos/active');
  });
