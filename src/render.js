import createElement from './createElement';
import createListItem from './createListItem';
import updateItemsLeft from './updateItemsLeft';
import addEventListeners from './addEventListeners';

export const todos = [];
let isFirstlyRendered = false;
let lastViewMode = 'All';

export function render(currentViewMode = lastViewMode) {
  if (!currentViewMode) {
    lastViewMode = currentViewMode;
  }
  if (document.querySelector('ul')) {
    while (document.querySelector('ul').firstChild) {
      document.querySelector('ul').removeChild(document.querySelector('ul').firstChild);
    }
  }
  let mainContainer = document.querySelector('.main-container');
  let inputField = document.querySelector('.input-field');
  let todosContainer = document.querySelector('.todos-container');
  let todoList = document.querySelector('.todo-list');
  let todoListSign = document.querySelector('.todo-list-sign');


  if (isFirstlyRendered) {
    mainContainer = createElement('section');
    mainContainer.classList.add('main-container');

    todoListSign = createElement('div');
    todoListSign.innerText = 'TODO LIST';
    todoListSign.classList.add('todo-list-sign');

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

    mainContainer.append(todoListSign, inputField, todosContainer, bottomPanel);
    document.body.append(mainContainer);

    isFirstlyRendered = true;
  }


  if (currentViewMode === 'All') {
    todos.forEach((todo, index) => {
      createListItem(todo, index, todoList, todos);
    });
  } else if (currentViewMode === 'Active') {
    todos.forEach((todo, index) => {
      if (!todo.isCompleted) {
        createListItem(todo, index, todoList, todos);
      }
    });
  } else if (currentViewMode === 'Completed') {
    todos.forEach((todo, index) => {
      if (todo.isCompleted) {
        createListItem(todo, index, todoList, todos);
      }
    });
  }
  todosContainer.append(todoList);
  updateItemsLeft(todos);
  addEventListeners();
}
