import css from './styles.css';

let todos = [];
let nextId = 1;
let currentViewMode = 'All';
let timeoutId;


function createElement(tagName) {
  return document.createElement(`${tagName.toUpperCase()}`);
}

async function fetchTodos(todosCopy = null) {
  const response = await fetch('http://localhost:9999', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  const result = await response.json();
  console.log(result);
  console.log(response.ok);
  if (response.ok) {
    todos = result;
  } else if (todosCopy) {
    todos = todosCopy;
  }
}

async function addToDB(todoTitle, todosCopy) {
  const response = await fetch('http://localhost:9999', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ title: `${todoTitle}` }),
  });
  const result = await response.json();
  fetchTodos(todosCopy);
}

async function removeFromDB(id, todosCopy) {
  const response = await fetch('http://localhost:9999', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(
      { _id: `${id}` },
    ),
  });
  fetchTodos(todosCopy);
  console.log(response);
  // if (response.ok && todos.length =)
  console.log(todos[index]._id);
}

async function updateInDB(idToUpdate, newProp, todosCopy) {
  const response = await fetch('http://localhost:9999', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ _id: idToUpdate, updKeyValue: newProp }),
  });
  console.log(response.json());
  fetchTodos(todosCopy);
}

function updateItemsLeft(todosArr) {
  let left = 0;
  todosArr.forEach((todo) => {
    if (!todo.isCompleted) {
      left += 1;
    }
  });
  if (left === 1) {
    document.querySelector('.quantity').innerText = '1 item left';
  } else {
    document.querySelector('.quantity').innerText = `${todosArr.filter(todo => todo.isCompleted === false).length} items left`;
  }
}


function addSrc(obj, index, node) {
  const newObj = Object.assign({}, obj);
  newObj.src = node;
  todos[index] = newObj;
}

function updateSrc(newTodos, oldTodos) {
  for (let i = 0; i < newTodos.length; i++) {
    newTodos[i].src = oldTodos[i].src;
  }
  // newTodos.forEach(newTodo, index) {
  //   newTodo.src = oldTodos[index].src;
  // }
}

function updateTodo(event) {
  const indexToUpdate = todos.findIndex(
    (todo) => {
      console.log(todos.src);
      return todo.src === event.target.closest('li');
    },
  );
  console.log(indexToUpdate);
  const updatingInputContainer = createElement('div');
  updatingInputContainer.classList.add('updating-input-container');
  const updatingInput = createElement('input');
  updatingInput.type = 'text';
  updatingInput.value = event.target.innerText;
  const submitButton = createElement('button');
  submitButton.type = 'button';
  submitButton.classList.add('submit-button');
  submitButton.innerHTML = '&#10004;';
  const cancelButton = createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('cancel-button');
  cancelButton.innerHTML = '&times';
  updatingInputContainer.append(updatingInput, submitButton, cancelButton);
  event.target.replaceWith(updatingInputContainer);
  submitButton.addEventListener('click', () => {
    if (indexToUpdate + 1) {
      todos[indexToUpdate].title = updatingInput.value;
      updateInDB(indexToUpdate, { title: updatingInput.value });
      fetchTodos();
      renderTodos(todos, currentViewMode);
    }
  });
  cancelButton.addEventListener('click', () => {
    fetchTodos();
    renderTodos(todos, currentViewMode);
  });
}

function filterAll() {
  currentViewMode = 'All';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-all').classList.add('active');
  renderTodos(todos, currentViewMode);
}

function filterActive() {
  currentViewMode = 'Active';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-active').classList.add('active');
  renderTodos(todos, currentViewMode);
}

function filterCompleted() {
  currentViewMode = 'Completed';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-completed').classList.add('active');
  renderTodos(todos, currentViewMode);
}

function addEventListeners() {
  let isDoubleClick;

  document.querySelector('.input-field').addEventListener('keydown', addTodo);

  const titleSpans = document.querySelectorAll('.title-span');
  titleSpans.forEach((span) => {
    span.addEventListener('dblclick', updateTodo);
  });
  titleSpans.forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
      if (isDoubleClick) {
        updateTodo(event);
      } else {
        toggleReadyState(event);
      }
      isDoubleClick = true;
      timeoutId = setTimeout(() => {
        isDoubleClick = false;
      }, 0);
    });
  });

  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeTodo);
  });

  const filterAllButton = document.querySelector('.filter-button-all');
  filterAllButton.addEventListener('click', filterAll);

  const filterActiveButton = document.querySelector('.filter-button-active');
  filterAllButton.addEventListener('click', filterActive);

  const filterCompletedButton = document.querySelector('.filter-button-completed');
  filterAllButton.addEventListener('click', filterCompleted);

  document.querySelector('.clear-completed-button').addEventListener('click', clearCompleted);
}

function fillTodoList(todo, index, todoList) {
  const todoItem = createElement('li');
  const connector = createElement('div');
  connector.classList.add('connector');
  todoItem.classList.add('todo-item');
  const checkbox = createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `checkbox_${todo._id}`;
  checkbox.checked = todo.isCompleted;
  checkbox.classList.add('checkbox');

  const todoTitle = createElement('span');
  todoTitle.classList.add('title-span');
  if (todo.isCompleted) {
    todoTitle.classList.add('completed');
  }
  todoTitle.innerText = todo.title;

  const removeButton = createElement('button');
  removeButton.innerHTML = '&times';
  removeButton.classList.add('remove-button');
  removeButton.type = 'button';
  connector.append(checkbox, todoTitle);
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


  const mainContainer = document.querySelector('.main-container') || createElement('section');
  if (!document.querySelector('.main-container')) {
    mainContainer.classList.add('main-container');
  }
  const inputField = document.querySelector('.input-field') || createElement('input');
  if (!document.querySelector('.input-field')) {
    inputField.classList.add('input-field');
    inputField.type = 'text';
  }
  const todosContainer = document.querySelector('.todos-container') || createElement('div');
  if (!document.querySelector('.todos-container')) {
    todosContainer.classList.add('todos-container');
  }
  const todoList = document.querySelector('.todo-list') || createElement('ul');
  if (!document.querySelector('.todo-list')) {
    todoList.classList.add('todo-list');
  }
  const bottomPanel = document.querySelector('.botom-panel') || createElement('div');
  if (!document.querySelector('.botom-panel')) {
    bottomPanel.classList.add('botom-panel');
  }

  const itemsLeft = document.querySelector('.quantity') || createElement('span');
  if (!document.querySelector('.quantity')) {
    itemsLeft.classList.add('quantity');
  }

  const buttonsContainer = document.querySelector('.filter-buttons-container') || createElement('div');
  if (!document.querySelector('.filter-buttons-container')) {
    buttonsContainer.classList.add('filter-buttons-container');
  }
  const showAllButton = document.querySelector('.filter-button-all') || createElement('button');
  if (!document.querySelector('.filter-button-all')) {
    showAllButton.type = 'button';
    showAllButton.classList.add('filter-button-all');
  }
  showAllButton.classList.add('active');
  showAllButton.innerText = 'All';
  const showActiveButton = document.querySelector('.filter-button-active') || createElement('button');
  if (!document.querySelector('.filter-button-active')) {
    showActiveButton.type = 'button';
    showActiveButton.classList.add('filter-button-active');
    showActiveButton.innerText = 'Active';
  }

  const showCompletedButton = document.querySelector('.filter-button-completed') || createElement('button');
  if (!document.querySelector('.filter-button-completed')) {
    showCompletedButton.type = 'button';
    showCompletedButton.classList.add('filter-button-completed');
    showCompletedButton.innerText = 'Completed';
    buttonsContainer.append(showAllButton, showActiveButton, showCompletedButton);
  }

  const clearCompletedButton = document.querySelector('.clear-completed-button') || createElement('button');
  if (!document.querySelector('.clear-completed-button')) {
    clearCompletedButton.type = 'button';
    clearCompletedButton.classList.add('clear-completed-button');
    clearCompletedButton.innerText = 'Clear Completed';
    bottomPanel.append(itemsLeft, buttonsContainer, clearCompletedButton);
  }

  mainContainer.append(inputField, todosContainer, bottomPanel);
  document.body.append(mainContainer);

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
  addEventListeners();
}

function addTodo(event) {
  const reserveCopy = [...todos];
  if (event.key === 'Enter') {
    const newTodo = {
      title: event.target.value,
      isCompleted: false,
      _id: nextId,
    };
    todos.push(newTodo);
    renderTodos(todos, currentViewMode);
    updateItemsLeft(todos);
    nextId += 1;
    addToDB(event.target.value, reserveCopy);
    event.target.value = '';
    event.target.focus();
  }
}

async function removeTodo(event) {
  const reserveCopy = [...todos];
  const index = todos.findIndex(todo => todo.src === event.target.closest('LI'));
  if (index + 1) {
    console.log(event.target.closest('LI'));
    const deletedTodo = todos.splice(index, 1);
    renderTodos(todos, currentViewMode);

    removeFromDB(todos[index]._id, reserveCopy);
    // if ((todos.findIndex(todo => todo._id === index) + 1)) {
    renderTodos(todos, currentViewMode);
    // }
  }
}


function clearCompleted() {
  todos = todos.filter(todo => !todo.isCompleted === true);
  fetchTodos();
  renderTodos(todos, currentViewMode);
}


function toggleReadyState(event) {
  timeoutId = setTimeout(() => {
    const reserveCopy = [...todos];
    let isChoosenCompleted = false;
    console.log(event.target.closest('LI'));
    const choosenIndex = todos.findIndex((todo) => {
      if (todo.src === event.target.closest('LI')) {
        isChoosenCompleted = todo.isCompleted;
        console.log(todo.src);
        return true;
      }
      return false;
    });
    console.log(choosenIndex);
    console.log(todos);
    if (isChoosenCompleted) {
      todos[choosenIndex].isCompleted = false;
    } else {
      todos[choosenIndex].isCompleted = true;
    }
    updateInDB(todos[choosenIndex]._id, { isCompleted: !todos[choosenIndex].isCompleted }, reserveCopy);
    renderTodos(todos, currentViewMode);
  }, 0);
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchTodos();
  renderTodos(todos, currentViewMode);
});
