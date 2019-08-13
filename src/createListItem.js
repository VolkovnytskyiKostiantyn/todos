import addSrc from './addSrc';
import createElement from './createElement';

export default function createListItem(todo, index, todoList, todos) {
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
  addSrc(todo, index, todoItem, todos);
}
