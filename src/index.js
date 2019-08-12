let todos = [];
let nextId = 1;
let currentViewMode = 'All';
let isFirstlyRendered = false;

function createElement(tag) {
  return document.createElement(`${tag.toUpperCase()}`);
}

function updateItemsLeft(todosArr) {
  let left = 0;
  todosArr.forEach((todo) => {
    if (!todo.isCompleted) {
      left += 1;
    }
  });
  if (left === 1) {
    document.querySelector('.quantity').innerText = `${left} item left`;
  } else {
    document.querySelector('.quantity').innerText = `${left} items left`;
  }
}

function addSrc(obj, index, node) {
  const newObj = Object.assign({}, obj);
  newObj.src = node;
  todos[index] = newObj;
}

function addEventListeners() {
  document.querySelector('.input-field').addEventListener('keyup', addTodo);

  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', toggleReadyState);
  });

  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeTodo);
  });

  const filterAllButton = document.querySelector('.filter-button-all');
  filterAllButton.addEventListener('click', () => {
    currentViewMode = 'All';
    document.querySelector('.active').classList.remove('active');
    document.querySelector('.filter-button-all').classList.add('active');
    renderTodos(todos, currentViewMode);
  });

  const filterActiveButton = document.querySelector('.filter-button-active');
  filterActiveButton.addEventListener('click', () => {
    currentViewMode = 'Active';
    document.querySelector('.active').classList.remove('active');
    document.querySelector('.filter-button-active').classList.add('active');
    renderTodos(todos, currentViewMode);
  });

  const filterCompletedButton = document.querySelector('.filter-button-completed');
  filterCompletedButton.addEventListener('click', () => {
    currentViewMode = 'Completed';
    document.querySelector('.active').classList.remove('active');
    document.querySelector('.filter-button-completed').classList.add('active');
    renderTodos(todos, currentViewMode);
  });

  document.querySelector('.clear-completed-button').addEventListener('click', clearCompleted);
}

function fillTodoList(todo, index, todoList) {
  const todoItem = createElement('li');
  const connector = createElement('div');
  connector.classList.add('connector');
  todoItem.classList.add('todo-item');
  const checkbox = createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `checkbox_${todo.id}`;
  checkbox.checked = todo.isCompleted;
  checkbox.classList.add('checkbox');

  const checkboxLabel = createElement('label');
  checkboxLabel.htmlFor = `checkbox_${todo.id}`;
  const todoTitle = createElement('span');
  if (todo.isCompleted) {
    todoTitle.classList.add('completed');
  }
  todoTitle.innerHTML = todo.title;
  checkboxLabel.append(todoTitle);

  const removeButton = createElement('button');
  removeButton.innerHTML = '&times';
  removeButton.classList.add('remove-button');
  removeButton.type = 'button';
  connector.append(checkbox, checkboxLabel);
  todoItem.append(connector, removeButton);

  todoList.append(todoItem);
  addSrc(todo, index, todoItem);
}

function renderTodos(todosArr, viewMode) {
  if (document.querySelector('ul')) {
    while (document.querySelector('ul').firstChild) {
      document.querySelector('ul').removeChild(document.querySelector('ul').firstChild);
    }
  }
  let mainContainer = document.querySelector('.main-container');
  let inputField = document.querySelector('.input-field');
  let todosContainer = document.querySelector('.todos-container');
  let todoList = document.querySelector('.todo-list');


  if (!isFirstlyRendered) {
    mainContainer = createElement('section');
    mainContainer.classList.add('main-container');
    inputField = createElement('input');
    inputField.classList.add('input-field');
    todosContainer = createElement('div');
    todosContainer.classList.add('todos-container');
    todoList = createElement('ul');
    todoList.classList.add('todo-list');

    const bottomPanel = createElement('div');
    bottomPanel.classList.add('botom-panel');

    const itemsLeft = createElement('span');
    itemsLeft.classList.add('quantity');

    const buttonsContainer = createElement('div');
    buttonsContainer.classList.add('filter-buttons-container');
    const showAllButton = createElement('button');
    showAllButton.type = 'button';
    showAllButton.classList.add('filter-button-all');
    showAllButton.classList.add('active');
    showAllButton.innerText = 'All';
    const showActiveButton = createElement('button');
    showActiveButton.type = 'button';
    showActiveButton.classList.add('filter-button-active');
    showActiveButton.innerText = 'Active';
    const showCompletedButton = createElement('button');
    showCompletedButton.type = 'button';
    showCompletedButton.classList.add('filter-button-completed');
    showCompletedButton.innerText = 'Completed';
    buttonsContainer.append(showAllButton, showActiveButton, showCompletedButton);

    const clearCompletedButton = createElement('button');
    clearCompletedButton.type = 'button';
    clearCompletedButton.classList.add('clear-completed-button');
    clearCompletedButton.innerText = 'Clear Completed';
    bottomPanel.append(itemsLeft, buttonsContainer, clearCompletedButton);

    mainContainer.append(inputField, todosContainer, bottomPanel);
    document.body.append(mainContainer);

    addEventListeners();
    isFirstlyRendered = true;
  }


  if (viewMode === 'All') {
    todosArr.forEach((todo, index) => {
      fillTodoList(todo, index, todoList);
    });
  } else if (viewMode === 'Active') {
    todos.forEach((todo, index) => {
      if (!todo.isCompleted) {
        fillTodoList(todo, index, todoList);
      }
    });
  } else if (viewMode === 'Completed') {
    todos.forEach((todo, index) => {
      if (todo.isCompleted) {
        fillTodoList(todo, index, todoList);
      }
    });
  }
  todosContainer.append(todoList);
  updateItemsLeft(todos);
}

function addTodo(event) {
  if (event.key === 'Enter') {
    todos.push({
      title: event.target.value,
      isCompleted: false,
      id: nextId,
    });
    renderTodos(todos, currentViewMode);
    addEventListeners();
    updateItemsLeft(todos);
    nextId += 1;
    document.querySelector('.input-field').value = '';
  }
}

function removeTodo(event) {
  const indexToDelete = todos.findIndex(todo => todo.src === event.target.parentNode);
  if (indexToDelete + 1) {
    todos.splice(indexToDelete, 1);
  }
  renderTodos(todos, currentViewMode);
  addEventListeners();
  updateItemsLeft(todos);
}

function clearCompleted() {
  todos = todos.filter(todo => !todo.isCompleted === true);
  renderTodos(todos, currentViewMode);
  addEventListeners();
  updateItemsLeft(todos);
}


function toggleReadyState(event) {
  let isChoosenCompleted = false;
  const choosenIndex = todos.findIndex((todo) => {
    if (todo.src === event.target.closest('LI')) {
      isChoosenCompleted = todo.isCompleted;
      return true;
    }
    return false;
  });
  if (isChoosenCompleted) {
    todos[choosenIndex].isCompleted = false;
  } else {
    todos[choosenIndex].isCompleted = true;
  }
  renderTodos(todos, currentViewMode);
  addEventListeners();
  updateItemsLeft(todos);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTodos(todos, currentViewMode);
  updateItemsLeft(todos);
});
