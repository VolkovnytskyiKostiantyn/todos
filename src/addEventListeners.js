import addTodo from './addTodo';
import toggleReadyState from './toggleReadyState';
import removeTodo from './removeTodo';
import filterAll from './filterAll';
import filterActive from './filterActive';
import filterCompleted from './filterCompleted';
import clearCompleted from './clearCompleted';

export default function addEventListeners() {
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
  filterAllButton.addEventListener('click', filterAll);

  const filterActiveButton = document.querySelector('.filter-button-active');
  filterActiveButton.addEventListener('click', filterActive);

  const filterCompletedButton = document.querySelector('.filter-button-completed');
  filterCompletedButton.addEventListener('click', filterCompleted);

  document.querySelector('.clear-completed-button').addEventListener('click', clearCompleted);
}
