(function() {
  const TodoListController = function($scope, localStorage, todos, viewFilter) {
    var vm = this;

    vm.viewFilter = viewFilter;
    vm.today = moment().unix();
    vm.data = {
      items: todos
    };

    vm.handleEnter = function(e) {
      if (e.which !== 13) {
        return;
      }

      $scope.todoList.$submit();
    };

    vm.addTodo = function(valid, todo, date) {
      if (!valid) { return; }
      var todo = {
        item: todo,
        createdOn: moment().unix(),
        complete: false,
        dueDate: date
      };

      vm.data.items.push(todo);
      vm.data.item = '';
      vm.data.dueDate = undefined;
      $scope.todoList.$setPristine();

      _saveTodos(vm.data.items);
    };

    vm.toggleComplete = function(todo) {
      todo.complete = !todo.complete;

      _saveTodos(vm.data.items);
    };

    vm.deleteTodo = function(todo) {
      vm.data.items.splice(vm.data.items.indexOf(todo), 1);

      _saveTodos(vm.data.items);
    };

    vm.updateTodo = function(valid, todo) {
      if(!valid) {
        return;
      }

      todo.item = todo._item;
      todo.dueDate = todo._dueDate;
      todo.update = false;

      _saveTodos(vm.data.items);
    };

    vm.toggleUpdateTodo = function(todo) {
      todo._item = todo.item;
      todo._dueDate = todo.dueDate;
      todo.update = !todo.update;
    };

    function _saveTodos(items) {
      localStorage.setObject('todos', items);
    };
  };

  TodoListController.$inject = ['$scope', 'localStorage', 'todos', 'viewFilter'];

  angular.module('todo').controller('todoListController', TodoListController);
})();